export class User {
  id?: string;
  title?: string;
  firstname?: string;
  lastname?: string;
  dob?: Date;
  income?: number;
  employment?: User_Enum.EmploymentStatusEnum;
  housenumber?: number;
  postcode?: string;

  constructor(
    title?,
    firstname?,
    lastname?,
    dob?,
    income?,
    employment?,
    housenumber?,
    postcode?
  ) {
    this.title = title ? title : '';
    this.firstname = firstname ? firstname : '';
    this.lastname = lastname ? lastname : '';
    this.dob = dob ? dob : new Date();
    this.income = income ? income : 0;
    this.employment = employment ? employment : null;
    this.housenumber = housenumber ? housenumber : null;
    this.postcode = postcode ? postcode : '';
  }
}

export namespace User_Enum {
  export type EmploymentStatusEnum = 'FULL' | 'PART' | 'STU' | 'NA';
  export const EmploymentStatusEnum = {
    FULL: 'FULL' as EmploymentStatusEnum,
    PART: 'PART' as EmploymentStatusEnum,
    STU: 'STU' as EmploymentStatusEnum,
    NA: 'NA' as EmploymentStatusEnum
  };
}
