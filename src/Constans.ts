interface IRideStatus {
  ACCEPTED: string;
  FINISHED: string;
  CANCELED: string;
  REQUESTING: string;
  ONROUTE: string;
}

const RIDE_STATUS: IRideStatus = {
  ACCEPTED: 'ACCEPTED',
  FINISHED: 'FINISHED',
  CANCELED: 'CANCELED',
  REQUESTING: 'REQUESTING',
  ONROUTE: 'ONROUTE',
};

Object.freeze(RIDE_STATUS);

export { RIDE_STATUS };
