import React, {useEffect, useState} from 'react';
import {Linking, Alert, Text} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCloudSunRain,
  faArrowUp,
  faArrowDown,
  faTint,
  faCloudRain,
  faWind,
  faDirections,
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';
import {
  Container,
  AppInfoView,
  AppTitleText,
  AuthorNameText,
  RowView,
  MinAndMaxView,
  TemperatureText,
  WeatherView,
  WeatherRowView,
  DateText,
  CenteredText,
  FooterView,
} from './styles';
import axios from 'axios';
import {Weather, DataEntity} from './types';
import {colors} from '../../Utils/theme';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {requestLocationPermission} from '../../Utils/permissions';
// @ts-ignore
import {API_KEY} from '@env';

const API_PATH = `https://apiadvisor.climatempo.com.br/api/v1`;

interface ICoord {
  lat: number | string;
  long: number | string;
}

interface IPlace {
  id: number | null;
  name: string;
  state?: string;
  country: string;
}

export default function Home() {
  const [weather, setWeather] = useState<Weather | undefined>(undefined);
  const [oldLocaleId, setOldLocaleId] = useState<number | string>('');
  const [registeredLocaleId, setRegisteredLocaleId] = useState<number | string>(
    '',
  );
  const [data, setData] = useState<DataEntity[]>([]);
  const [coord, setCoord] = useState<ICoord>({lat: 0, long: 0});
  const [place, setPlace] = useState<IPlace>({
    id: null,
    name: '',
    country: '',
  });

  const storeLocaleId = async (value: string) => {
    try {
      await AsyncStorage.setItem('@locale_id', value);
    } catch (e) {
      Alert.alert('storeLocaleId', e);
    }
  };

  const storeWeatherData = async (value: Weather) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@weather_data', jsonValue);
    } catch (e) {
      Alert.alert('storeWeatherData', e);
    }
  };

  const getWeatherData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@weather_data');
      if (jsonValue != null) {
        const parsedJson = JSON.parse(jsonValue);
        setWeather(parsedJson);
        setData(parsedJson?.data);
      } else {
        GetRegisteredLocale();
      }
    } catch (e) {
      Alert.alert('getWeatherData', e);
    }
  };

  const getLocaleId = async () => {
    try {
      const value = await AsyncStorage.getItem('@locale_id');
      if (value !== null) {
        setOldLocaleId(value);
      }
    } catch (e) {
      Alert.alert('getLocaleId', e);
    }
  };

  const GetRegisteredLocale = () => {
    const url = `https://apiadvisor.climatempo.com.br/api-manager/user-token/${API_KEY}/locales`;

    axios
      .get(url)
      .then((response: any) => {
        const currentRegisteredLocales = response?.data?.locales;

        GetWeatherData(currentRegisteredLocales[0]);
      })
      .catch(function (error) {
        Alert.alert('GetRegisteredLocale', error?.response?.data);
      });
  };

  const GetWeatherData = (localeId: any) => {
    const url = `${API_PATH}/forecast/locale/${localeId}/days/15?token=${API_KEY}`;

    axios
      .get(url)
      .then((response: any) => {
        const currentWeather = response?.data;

        storeWeatherData(currentWeather);
        setWeather(currentWeather);
        setData(currentWeather?.data);
      })
      .catch(function (error) {
        Alert.alert('GetWeatherData', error?.response?.data);
      });
  };

  const RegisterLocationOnAPI = (localeId: any) => {
    const url = `https://apiadvisor.climatempo.com.br/api-manager/user-token/${API_KEY}/locales`;

    axios
      .put(url, {'localeId[]': localeId})
      .then((response: any) => {
        storeLocaleId(localeId);
        GetWeatherData(localeId);
      })
      .catch((error) => {
        getWeatherData();
      });
  };

  const GetWeatherInformationFromLatAndLong = (
    lat: string | number,
    long: string | number,
  ) => {
    axios
      .get(
        `${API_PATH}/locale/city?latitude=${lat}&longitude=${long}&token=${API_KEY}`,
      )
      .then((response: any) => {
        const currentPlace = response?.data;

        setPlace(currentPlace);

        RegisterLocationOnAPI(currentPlace?.id);
      })
      .catch((error) => {
        Alert.alert('GetWeatherInformationFromLatAndLong', error?.response?.data);
      });
  };

  interface IWeatherRowDynamicView {
    leftInfo: string | number;
    leftInfoUnit: string;
    leftInfoIcon: IconProp;
    leftInfoIconColor?: string;
    leftInfoDescription: string;
    rightInfo: string | number;
    rightInfoUnit: string;
    rightInfoIcon: IconProp;
    rightInfoIconColor?: string;
    rightInfoDescription: string;
  }

  const WeatherRowDynamicView = ({
    leftInfo,
    leftInfoUnit,
    leftInfoIcon,
    leftInfoIconColor = colors.grey,
    leftInfoDescription,
    rightInfo,
    rightInfoUnit,
    rightInfoIcon,
    rightInfoIconColor = colors.grey,
    rightInfoDescription,
  }: IWeatherRowDynamicView) => (
    <RowView>
      <MinAndMaxView>
        <RowView>
          <FontAwesomeIcon
            icon={leftInfoIcon}
            size={16}
            color={leftInfoIconColor}
          />
          <TemperatureText>
            {leftInfo}
            {leftInfoUnit}
          </TemperatureText>
        </RowView>
        <Text>{leftInfoDescription}</Text>
      </MinAndMaxView>
      <MinAndMaxView>
        <RowView>
          <FontAwesomeIcon
            icon={rightInfoIcon}
            size={16}
            color={rightInfoIconColor}
          />
          <TemperatureText>
            {rightInfo}
            {rightInfoUnit}
          </TemperatureText>
        </RowView>
        <Text>{rightInfoDescription}</Text>
      </MinAndMaxView>
    </RowView>
  );

  useEffect(() => {
    getLocaleId();

    requestLocationPermission(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          const currentCoord = {
            lat: position?.coords?.latitude,
            long: position?.coords?.longitude,
          };

          setCoord(currentCoord);

          GetWeatherInformationFromLatAndLong(
            currentCoord?.lat,
            currentCoord?.long,
          );
        },
        (error) => {
          Alert.alert('requestLocationPermission', error?.code, error?.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  }, [oldLocaleId]);

  return (
    <Container>
      <AppInfoView>
        <FontAwesomeIcon icon={faCloudSunRain} size={64} />
        <AppTitleText>Avisa Clima</AppTitleText>
        <AuthorNameText
          onPress={() => Linking.openURL('https://github.com/DenysMb')}>
          por Denys Madureira
        </AuthorNameText>
      </AppInfoView>
      <WeatherView>
        {data?.map((row: DataEntity, index: number) => (
          <WeatherRowView key={`${index}-${row?.date}`}>
            <DateText>Data: {row?.date_br}</DateText>
            <WeatherRowDynamicView
              leftInfo={row?.temperature?.min}
              leftInfoUnit={'° C'}
              leftInfoIcon={faArrowDown}
              leftInfoIconColor={colors.blue}
              leftInfoDescription={'Temperatura mínima'}
              rightInfo={row?.temperature?.max}
              rightInfoUnit={'° C'}
              rightInfoIcon={faArrowUp}
              rightInfoIconColor={colors.red}
              rightInfoDescription={'Temperatura máxima'}
            />
            <WeatherRowDynamicView
              leftInfo={row?.rain?.precipitation}
              leftInfoUnit={'mn'}
              leftInfoIcon={faTint}
              leftInfoDescription={'Precipitação da chuva'}
              rightInfo={row?.rain?.probability}
              rightInfoUnit={'%'}
              rightInfoIcon={faCloudRain}
              rightInfoDescription={'Probabilidade de chuva'}
            />
            <WeatherRowDynamicView
              leftInfo={row?.wind?.direction}
              leftInfoUnit={''}
              leftInfoIcon={faDirections}
              leftInfoDescription={'Direção do vento'}
              rightInfo={row?.wind?.velocity_avg}
              rightInfoUnit={'km/h'}
              rightInfoIcon={faWind}
              rightInfoDescription={'Velocidade do vento'}
            />
            <WeatherRowDynamicView
              leftInfo={row?.humidity?.min}
              leftInfoUnit={'%'}
              leftInfoIcon={faArrowDown}
              leftInfoIconColor={colors.blue}
              leftInfoDescription={'Humidade mínima'}
              rightInfo={row?.humidity?.max}
              rightInfoUnit={'%'}
              rightInfoIcon={faArrowUp}
              rightInfoIconColor={colors.red}
              rightInfoDescription={'Humidade máxima'}
            />
            <WeatherRowDynamicView
              leftInfo={row?.sun?.sunrise?.substr(0, 5)}
              leftInfoUnit={'h'}
              leftInfoIcon={faSun}
              leftInfoDescription={'Alvorecer'}
              rightInfo={row?.sun?.sunset?.substr(0, 5)}
              rightInfoUnit={'h'}
              rightInfoIcon={faMoon}
              rightInfoDescription={'Anoitecer'}
            />
          </WeatherRowView>
        ))}
      </WeatherView>
      <FooterView>
        <CenteredText>
          Localização atual: {place?.name}, {place?.country}
        </CenteredText>
        <CenteredText>
          Exibindo informações de: {weather?.name}, {weather?.country}
        </CenteredText>
      </FooterView>
    </Container>
  );
}
