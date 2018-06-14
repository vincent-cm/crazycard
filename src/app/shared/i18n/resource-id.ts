/**
 * This class is list of resource id for i18n.
 * All the string is static field, and if want to use in html, need to define a variable in the
 * corresponding ts file to use in the template.
 */
export class ResourceId {
  public static readonly VALIDATION = {
    REQUIRED: 'VALIDATION.REQUIRED',
    PATTERN: 'VALIDATION.PATTERN'
  };
  public static readonly DATATABLE = {
    emptyMessage: 'DATATABLE.emptyMessage',
    totalMessage: 'DATATABLE.totalMessage'
  };
  public static readonly USER = {
    TITLE: 'USER.SEARCHING.TITLE',
    FIRSTNAME: 'USER.SEARCHING.FIRSTNAME',
    LASTNAME: 'USER.SEARCHING.LASTNAME',
    DOB: 'USER.SEARCHING.DOB',
    INCOME: 'USER.SEARCHING.INCOME',
    EMPLOYMENT: 'USER.SEARCHING.EMPLOYMENT',
    HOUSENUMBER: 'USER.SEARCHING.HOUSENUMBER',
    POSTCODE: 'USER.SEARCHING.POSTCODE'
  };
}
