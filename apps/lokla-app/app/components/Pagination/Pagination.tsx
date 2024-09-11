'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';

type PaginationProps = {
  totalPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = (props: PaginationProps) => {
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

    if (props.currentPage - begin[begin.length - 1] > 1) {
      result = [...result, -1];
    }

    if (
      props.currentPage > begin[begin.length - 1] &&
      props.currentPage < end[0]
    ) {
      result = [...result, props.currentPage];
    }

    if (end[0] - props.currentPage > 1) {
      result = [...result, -1];
    }

    result = [...result, ...end];

    return result;
  };

  return (
    <div className="flex flex-row gap-x-4 justify-end mt-6 items-end">
      <IconButton
        aria-label="Pagination"
        onClick={() => {
          if (props.currentPage > 0) {
            props.onPageChange(props.currentPage - 1);
          }
        }}
        isDisabled={props.currentPage === 0}
      >
        <ChevronLeftIcon />
      </IconButton>
      {generatePageItem().map((item, index) =>
        item >= 0 ? (
          <IconButton
            aria-label="Pagination"
            key={item}
            onClick={() => props.onPageChange(item)}
            colorScheme={item === props.currentPage ? 'blue' : 'gray'}
          >
            <div>{item + 1}</div>
          </IconButton>
        ) : (
          <p key={`blank_${index}`}>...</p>
        )
      )}
      <IconButton
        aria-label="Pagination"
        onClick={() => {
          if (props.currentPage < props.totalPage - 1) {
            props.onPageChange(props.currentPage + 1);
          }
        }}
        isDisabled={props.currentPage === props.totalPage - 1}
      >
        <ChevronRightIcon />
      </IconButton>
    </div>
  );
};

export default Pagination;
