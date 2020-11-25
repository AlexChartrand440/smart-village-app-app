import { Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { addToStore, readFromStore } from '../helpers';
import { device, texts } from '../config';
import { handleIncomingToken, PushNotificationStorageKeys } from './TokenHandling';

const setInAppPermission = async (newValue: boolean) => {
  const oldValue = await readFromStore(PushNotificationStorageKeys.IN_APP_PERMISSION);

  if (newValue !== oldValue) {
    // FIXME error handling: sync with server failed, etc
    addToStore(PushNotificationStorageKeys.IN_APP_PERMISSION, newValue);

    if (newValue) {
      const hasPermission = await handleSystemPermissions();

      if (!hasPermission) {
        showSystemPermissionMissingDialog();
      } else {
        registerForPushNotificationsAsync()
          .then(handleIncomingToken);
      }
    } else {
      // remove token from store and notify server
      handleIncomingToken();
    }
  }
};

export const initializePushPermissions = async () => {
  const inAppPermission = await readFromStore(PushNotificationStorageKeys.IN_APP_PERMISSION);

  inAppPermission && updatePushToken();

  // this will only show the alert if inAppPermission is undefined (or null), but not if it is false
  inAppPermission ?? showInitialPushAlert();
};

const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
  const { data: token } = await Notifications.getExpoPushTokenAsync();

  if (device.platform === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX, // FIXME: check for reasonable value
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    });
  }

  return token;
};

const handleSystemPermissions = async (): Promise<boolean> => {

  // Push notifications do not work properly with simulators/emulators
  if (!Constants.isDevice) return false;

  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

  let finalStatus = existingStatus;

  if (existingStatus === Permissions.PermissionStatus.UNDETERMINED) {
    const { status: askedStatus } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = askedStatus;
  }

  return finalStatus === Permissions.PermissionStatus.GRANTED;
};

export const updatePushToken = async () => {
  await handleSystemPermissions()
    .then((hasPermission) => {
      if (hasPermission) return registerForPushNotificationsAsync();
    })
    .then(handleIncomingToken);
};

const showSystemPermissionMissingDialog = () => {
  const { permissionMissingBody, permissionMissingTitle } = texts.pushNotifications;

  Alert.alert(
    permissionMissingTitle,
    permissionMissingBody,
    undefined,
    { cancelable: false }
  );
};

const showInitialPushAlert = (): void => {
  const { greetingBody, greetingTitle, approve, decline } = texts.pushNotifications;

  Alert.alert(
    greetingTitle,
    greetingBody,
    [
      {
        text: decline,
        onPress: () => setInAppPermission(false),
        style: 'cancel'
      },
      {
        text: approve,
        onPress: () => setInAppPermission(true)
      }
    ],
    { cancelable: false }
  );
};
