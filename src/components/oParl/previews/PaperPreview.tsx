import React from 'react';
import { NavigationScreenProp } from 'react-navigation';

import { texts } from '../../../config';
import { PaperPreviewData } from '../../../types';
import { RegularText } from '../../Text';
import { OParlItemPreview } from './OParlItemPreview';

type Props = {
  data: PaperPreviewData;
  navigation: NavigationScreenProp<never>;
};

export const PaperPreview = ({ data, navigation }: Props) => {
  const { id, deleted, name, reference } = data;

  return (
    <OParlItemPreview id={id} navigation={navigation}>
      <RegularText numberOfLines={1} primary lineThrough={deleted}>
        {name || reference || texts.oparl.paper.paper}
      </RegularText>
    </OParlItemPreview>
  );
};