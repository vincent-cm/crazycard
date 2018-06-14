import { User, User_Enum } from './_models';

export const mockUser1: User = {
  title: 'Mr',
  firstname: 'Ollie',
  lastname: 'Murphree',
  dob: new Date('1970-07-01T00:00:00Z'),
  income: 34000,
  employment: User_Enum.EmploymentStatusEnum.FULL,
  housenumber: 700,
  postcode: 'BS14 9PR'
};

export const mockUser2: User = {
  title: 'Miss',
  firstname: 'Elizabeth',
  lastname: 'Edmundson',
  dob: new Date('1984-06-29T00:00:00Z'),
  income: 17000,
  employment: User_Enum.EmploymentStatusEnum.STU,
  housenumber: 177,
  postcode: 'PH12 8UW'
};

export const mockUser3: User = {
  title: 'Mr',
  firstname: 'Trevor',
  lastname: 'Rieck',
  dob: new Date('1990-09-07T00:00:00Z'),
  income: 15000,
  employment: User_Enum.EmploymentStatusEnum.PART,
  housenumber: 343,
  postcode: 'TS25 2NF'
};
