import { rideStatus } from '../types/types';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { RIDE_STATUS } from '../Constans';

import User from './User';

@Entity()
class Ride extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    enum: [
      RIDE_STATUS.ACCEPTED,
      RIDE_STATUS.FINISHED,
      RIDE_STATUS.CANCELED,
      RIDE_STATUS.REQUESTING,
      RIDE_STATUS.ONROUTE,
    ],
    default: RIDE_STATUS.REQUESTING,
  })
  status: rideStatus;

  @Column({ type: 'text' })
  pickUpAddress: string;

  @Column({ type: 'double precision', default: 0 })
  pickUpLat: number;

  @Column({ type: 'double precision', default: 0 })
  pickUpLng: number;

  @Column({ type: 'text' })
  dropOffAddress: string;

  @Column({ type: 'double precision', default: 0 })
  dropOffLat: number;

  @Column({ type: 'double precision', default: 0 })
  dropOffLng: number;

  @Column({ type: 'double precision', default: 0 })
  price: number;

  @Column({ type: 'text' })
  distance: string;

  @Column({ type: 'text' })
  duration: string;

  // [릴레이션십FieldName]Id 로 컬럼을 추가하면 foreign Key를 찾아서 자동으로 보여준다 TypeORm이
  @Column({ nullable: true })
  passengerId: number;
  // Ride의 종류는 운전자와 탑승자가 있고 passenger 또는 driver는 여러 User를 될 수 있다.
  @ManyToOne(type => User, user => user.ridesAsPassenger)
  passenger: User;

  @Column({ nullable: true })
  driverId: number;
  @ManyToOne(type => User, user => user.ridesAsDriver, { nullable: true })
  driver: User;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
export default Ride;
