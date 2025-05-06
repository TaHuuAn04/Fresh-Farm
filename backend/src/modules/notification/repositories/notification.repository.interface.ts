import { Notification } from "@entities";


export interface INotificationRepository {
  create(data: Partial<Notification>): Notification;
  save(noti: Notification): Promise<Notification>;
  find(): Promise<Notification[]>;
  findOneById(id: string): Promise<Notification | null>;
  remove(noti: Notification): Promise<void>;
}
