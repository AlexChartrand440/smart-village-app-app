import React, { useContext } from 'react';
import { QueryHookOptions, useQuery } from 'react-apollo';
import { ActivityIndicator, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { colors, consts, device } from '../config';
import { parseListItemsFromQuery } from '../helpers';
import { useHomeRefresh } from '../hooks/HomeRefresh';
import { getQuery } from '../queries';
import { SettingsContext } from '../SettingsProvider';
import { Button } from './Button';
import { ListComponent } from './ListComponent';
import { LoadingContainer } from './LoadingContainer';
import { Title, TitleContainer, TitleShadow } from './Title';
import { Touchable } from './Touchable';
import { Wrapper } from './Wrapper';

type Props = {
  title: string;
  titleDetail?: string;
  buttonTitle: string;
  fetchPolicy:
    | 'cache-first'
    | 'network-only'
    | 'cache-only'
    | 'no-cache'
    | 'standby'
    | 'cache-and-network';
  navigate: () => void;
  navigation: NavigationScreenProp<never>;
  query: string;
  queryParser?: (data: unknown) => unknown[];
  queryVariables: QueryHookOptions;
};

export const HomeSection = ({
  buttonTitle,
  title,
  titleDetail,
  fetchPolicy,
  navigate,
  navigation,
  query,
  queryParser,
  queryVariables
}: Props) => {
  const { listTypesSettings } = useContext(SettingsContext);
  const listType = listTypesSettings[query];

  const { data, loading, refetch } = useQuery(getQuery(query), {
    variables: queryVariables,
    fetchPolicy
  });

  useHomeRefresh(refetch);

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator color={colors.accent} />
      </LoadingContainer>
    );
  }

  const items =
    queryParser?.(data) ?? parseListItemsFromQuery(query, data, true, titleDetail ?? '');

  if (!items || !items.length) return null;

  return (
    <>
      <TitleContainer>
        <Touchable onPress={navigate}>
          <Title accessibilityLabel={`${title} (Überschrift) (Taste)`}>{title}</Title>
        </Touchable>
      </TitleContainer>
      {device.platform === 'ios' && <TitleShadow />}

      <View>
        <ListComponent
          navigation={navigation}
          data={items}
          query={query}
          horizontal={listType === consts.LIST_TYPES.CARD_LIST}
        />

        <Wrapper>
          <Button title={buttonTitle} onPress={navigate} />
        </Wrapper>
      </View>
    </>
  );
};
