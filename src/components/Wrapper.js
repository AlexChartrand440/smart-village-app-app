import styled, { css } from 'styled-components/native';

import { normalize } from '../config';

export const Wrapper = styled.View`
  flex: 1;
  padding: ${normalize(14)}px;
`;

export const ScrollWrapper = styled.ScrollView`
  height: 100%;
`;

export const WrapperRow = styled.View`
  flex: 1;
  flex-direction: row;

  ${(props) =>
    props.space &&
    css`
      justify-content: space-between;
    `};
`;

export const WrapperWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
`;
