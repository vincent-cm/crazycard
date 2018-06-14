import { Injectable } from '@angular/core';
import { Level, Log } from 'ng2-logger';

/**
 * we use this time to define all the log, for example, we log in several component, and every component is on log item.
 */
export interface LogEntry {
  key: string;
  color: string;
  name: string;
  level: Level[];
}

export const LOG_ENTRIES: { [key: string]: LogEntry } = {
  lang_picker: {
    key: 'lang-picker',
    color: '#ff1100',
    name: 'lang-picker',
    level: [Level.INFO]
  },
  attributes_table: {
    key: 'attributes-table',
    color: '#05ff6c',
    name: 'attributes-table',
    level: [Level.INFO]
  },
  red: {
    key: 'red',
    color: '#ff0000',
    name: 'red',
    level: [Level.INFO]
  },
  blue: {
    key: 'blue',
    color: '#0000ff',
    name: 'blue',
    level: [Level.INFO]
  },
  green: {
    key: 'green',
    color: '#00ff00',
    name: 'green',
    level: [Level.INFO]
  }
};

@Injectable()
export class LogHelperService {

  constructor() { }

  iniLoggerConfig() {
    // enable production mode in your app
    // Log.setProductionMode();
    // Log.onlyModules('src:config');

    Log.onlyLevel(Level.ERROR, Level.WARN, Level.DATA, Level.INFO);
  }
}
