import { VOUser } from "valueobject/VOUser";
import { VOHomeApp } from "valueobject/VOHomeApp";
import { HomeApp } from "presenter/HomeApp";

export class EventsHandler {
  public static async home({type, user, channel, tab, text, subtype}: any): Promise<void> {
    const inputUser: VOUser = VOUser.of(user);
    const view: VOHomeApp = VOHomeApp.of(inputUser);
    const appView: HomeApp = HomeApp.ofUser(inputUser);
    await appView.displayHome(view);
  }
}