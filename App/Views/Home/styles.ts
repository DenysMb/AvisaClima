// @ts-ignore
import styled from 'styled-components/native';
import {colors} from '../../Utils/theme';

export const Container = styled.View`
  height: 100%;
`;

export const AppInfoView = styled.View`
  align-items: center;
  justify-content: center;
  padding: 10px 5px;
  background-color: ${colors.grey}
  border-bottom-color: ${colors.black};
  border-bottom-width: 1px;
`;

export const AppTitleText = styled.Text`
  font-size: 26px;
  font-weight: 700;
`;

export const AuthorNameText = styled.Text`
  font-size: 14px;
`;

export const RowView = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const MinAndMaxView = styled.View`
  align-items: center;
  flex: 1;
`;

export const TemperatureText = styled.Text`
  font-size: 24px;
  margin-left: 5px;
`;

export const WeatherView = styled.ScrollView`
  height: 100%;
`;

export const WeatherRowView = styled.View`
  padding-bottom: 10px;
`;

export const DateText = styled.Text`
  font-size: 16px;
  background-color: #c4c4c4;
  color: #000;
  text-align: center;
`;

export const CenteredText = styled.Text`
  text-align: center;
`;

export const FooterView = styled.View`
    padding: 10px 5px;
    background-color: ${colors.grey}
    border-top-color: ${colors.black};
    border-top-width: 1px;
`;