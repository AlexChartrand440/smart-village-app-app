import { consts, texts } from '../config';
import { GenericType } from '../types';

export const getGenericItemDetailTitle = (genericType: GenericType): string => {
  switch (genericType) {
    case GenericType.commercial:
      return texts.commercial.commercial;
    case GenericType.Job:
      return texts.job.job;
  }
};

const { ROOT_ROUTE_NAMES } = consts;

export const getGenericItemRootRouteName = (genericType: GenericType): string => {
  switch (genericType) {
    case GenericType.commercial:
      return ROOT_ROUTE_NAMES.COMMERCIALS;
    case GenericType.Job:
      return ROOT_ROUTE_NAMES.JOBS;
  }
};
