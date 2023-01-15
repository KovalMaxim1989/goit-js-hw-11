import { Notify } from 'notiflix/build/notiflix-notify-aio';

const notifyOptions = {
  position: 'center-bottom',
  distance: '50px',
  timeout: 4000,
  clickToClose: true,
  cssAnimationStyle: 'from-bottom',
  showOnlyTheLastOne: true,
};

export const errorMessage =
  'Sorry, no match, try another search.';

const infoMessage =
  "Thats all.";

export class NotifyMessage {
  constructor() {
    this.errorMessage = errorMessage;
    this.infoMessage = infoMessage;
    this.options = notifyOptions;
  }

  showSuccessMessage(message) {
    Notify.success(message);
  }
  showFailureMessage(message) {
    Notify.failure(message);
  }
  showInfoMessage() {
    Notify.info(this.infoMessage, this.options);
  }
}