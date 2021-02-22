import React, { useCallback, useContext } from 'react';
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
  additionalQuery?: {
    fetchPolicy:
      | 'cache-first'
      | 'network-only'
      | 'cache-only'
      | 'no-cache'
      | 'standby'
      | 'cache-and-network';
    titleDetail?: string;
    query: string;
    queryParser?: (data: unknown) => unknown[];
    queryVariables: QueryHookOptions;
  };
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

// this sorting function does not induce a total order if there are entries that have neither of those dates
// in that case the sorting result will depend on the algorithm used
const sortByDate = (
  a: { createdAt?: string; listDate?: string; publishedAt?: string },
  b: { createdAt?: string; listDate?: string; publishedAt?: string }
) => {
  // prioritize available dates in the following order: listDate > publishedAt > createdAt
  const dateA = a.listDate ?? a.publishedAt ?? a.createdAt;
  const dateB = b.listDate ?? b.publishedAt ?? b.createdAt;

  if (dateA && dateB) {
    return new Date(dateB).valueOf() - new Date(dateA).valueOf();
  }
  return 0;
};

// eslint-disable-next-line complexity
export const HomeSection = ({
  additionalQuery,
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

  const { data: additionalData, loading: additionalLoading, refetch: additionalRefetch } = useQuery(
    // use query as a fallback, to avoid unhandled undefined values.
    // the query will be skipped in that case.
    getQuery(additionalQuery?.query ?? query),
    {
      variables: additionalQuery?.queryVariables,
      fetchPolicy: additionalQuery?.fetchPolicy,
      skip: !additionalQuery
    }
  );

  const refetchAll = useCallback(() => {
    additionalRefetch?.();
    refetch?.();
  }, [additionalRefetch, refetch]);

  useHomeRefresh(refetchAll);

  if (loading || additionalLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator color={colors.accent} />
      </LoadingContainer>
    );
  }

  const items =
    queryParser?.(data) ?? parseListItemsFromQuery(query, data, false, titleDetail ?? '');

  const additionalItems =
    additionalQuery?.queryParser?.(additionalData) ??
    parseListItemsFromQuery(
      additionalQuery?.query,
      additionalData,
      false,
      additionalQuery?.titleDetail ?? ''
    );

  const mergedItems = additionalItems
    ? [...(items ?? []), ...additionalItems].sort(sortByDate)
    : items;

  if (!mergedItems.length) return null;

  mergedItems[mergedItems.length - 1].bottomDivider = undefined;

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
          data={mergedItems}
          // use primary query to determine list type
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
