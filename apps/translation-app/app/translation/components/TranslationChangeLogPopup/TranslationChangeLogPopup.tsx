import React from 'react';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { TranslationChangeLogEvent } from 'enums/TranslationChangeLogEvent';

import { TranslationChangeLog } from '../../models/TranslationData';

const TranslationChangeLogPopup = (props: {
  changeLog: TranslationChangeLog;
}) => {
  const getChangeEventBadge = (eventType: TranslationChangeLogEvent) => {
    switch (eventType) {
      case TranslationChangeLogEvent.CREATE:
        return (
          <span className="bg-green-500 text-white px-2 py-1 rounded-md">
            Create
          </span>
        );

      case TranslationChangeLogEvent.UPDATE:
        return (
          <span className="bg-yellow-500 text-white px-2 py-1 rounded-md">
            Update
          </span>
        );

      case TranslationChangeLogEvent.DELETE:
        return (
          <span className="bg-red-500 text-white px-2 py-1 rounded-md">
            Delete
          </span>
        );
    }
  };

  return (
    <div>
      <h1 className="mb-4">Translation Change Log</h1>

      <div className="flex flex-col space-y-4 max-h-[500px] overflow-y-auto">
        {props.changeLog?.map((item, idx) => (
          <div
            key={idx}
            className="w-[500px] border border-neutral-200 rounded-lg p-4"
          >
            <div>{getChangeEventBadge(item.eventType)}</div>
            <div className="flex flex-row w-full mt-2">
              <div className="flex-1">{item.before}</div>
              <FontAwesomeIcon icon={faArrowRight} />
              <div className="flex-1 text-right">{item.after}</div>
            </div>
            <div>Locale: {item.locale}</div>
            <div>{format(new Date(item.date), 'yyyy-MM-dd HH:mm:ss')}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranslationChangeLogPopup;
