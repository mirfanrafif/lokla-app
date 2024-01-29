'use client';

import React from 'react';

import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { usePathname, useSearchParams } from 'next/navigation';

import styles from './Pagination.module.scss';

const Pagination = (props: { totalPage: number; currentPage: number }) => {
  const params = useSearchParams();
  const pathName = usePathname();
  const currentPage = params.get('page') ? Number(params.get('page')) : 0;

  const generatePage = (newPage: number) => {
    const newParams = new URLSearchParams(params);

    newParams.set('page', newPage.toString());

    return `${pathName}?${newParams.toString()}`;
  };

  const generatePageItem = (): Array<number> => {
    if (props.totalPage <= 4) {
      return Array(props.totalPage)
        .fill(0)
        .map((_, index) => index);
    }

    const begin = [0, 1];
    const end = [props.totalPage - 2, props.totalPage - 1];

    let result: Array<number> = [];

    result = [...begin];

    if (currentPage - begin[begin.length - 1] > 1) {
      result = [...result, -1];
    }

    if (currentPage > begin[begin.length - 1] && currentPage < end[0]) {
      result = [...result, currentPage];
    }

    if (end[0] - currentPage > 1) {
      result = [...result, -1];
    }

    result = [...result, ...end];

    return result;
  };

  return (
    <div className="flex flex-row gap-x-4 justify-end mt-6 items-end">
      <a className={styles.paginationItem} href={generatePage(currentPage - 1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </a>
      {generatePageItem().map((item) =>
        item >= 0 ? (
          <a
            key={item}
            className={classNames(styles.paginationItem, {
              [styles.active]: item === currentPage,
            })}
            href={generatePage(item)}
          >
            {item + 1}
          </a>
        ) : (
          <p key={''}>...</p>
        ),
      )}
      <a className={styles.paginationItem} href={generatePage(currentPage + 1)}>
        <FontAwesomeIcon icon={faArrowRight} />
      </a>
    </div>
  );
};

export default Pagination;
