/* eslint-disable */
import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { DashboardFilterResult, DashboardResultItem } from 'sdk/modules/dashboard/dashboardInterface';
import { EMPTY_STRING } from 'consts';
import { useSelector } from 'react-redux';
import { schoolFilterBySelector } from 'sdk/modules/dashboard/dashboardSelector';
import { SCHOOL_FILTER_BY_GENERAL_URBAN } from 'sdk/modules/dashboard/dashboardConfig';

const computeTotals = (data: DashboardFilterResult) => {
  const rowTotals: Record<string, number> = {};
  const colTotals: Record<string, number> = {};
  let overallTotal = 0;

  Object.keys(data).forEach(category => {
    let rowTotal = 0;
    data[category].forEach(item => {
      rowTotal += item.total;
      colTotals[item.key] = (colTotals[item.key] || 0) + item.total;
    });
    rowTotals[category] = rowTotal;
    overallTotal += rowTotal;
  });

  return { rowTotals, colTotals, overallTotal };
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    fontWeight: 'bold',
    backgroundColor: theme.palette.background.default,
  },
  '&.MuiTableCell-sticky': {
    position: 'sticky',
    right: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1,
    boxShadow: 'inset 1px 0px 0px 0px rgba(0, 0, 0, 0.12)',
  },
  
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const DashboardTable: React.FC<{ data: DashboardFilterResult }> = ({ data }) => {
  const { t } = useTranslation();
  const { rowTotals, colTotals, overallTotal } = computeTotals(data);
  const isGeneralSchoolUrbanSelected = useSelector(schoolFilterBySelector) === SCHOOL_FILTER_BY_GENERAL_URBAN;
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>

            
        <TableHead>
          <StyledTableRow>
            <StyledTableCell >{EMPTY_STRING}</StyledTableCell>
            {Object.values(data)[0].map((item: DashboardResultItem) => (
              <StyledTableCell key={item.key}>{item.displayValue}</StyledTableCell>
            ))}
            {
              !isGeneralSchoolUrbanSelected && (
                <StyledTableCell className="MuiTableCell-sticky MuiTableCell-head">{t('summary.total')}</StyledTableCell>
              )
            }
          </StyledTableRow>
        </TableHead>

 
        <TableBody>
          {Object.keys(data).map((category, index) => (
            <StyledTableRow key={index}>
              <TableCell sx={{textAlign: 'right', fontWeight: '800'}}>{category}</TableCell>
              {data[category].map(item => (
                <TableCell key={item.key} sx={{fontSize: item.total > 0 ? 15 : 14, color: item.total <= 0 ? '#737373' : '#000'}}>{item.total}</TableCell>
              ))}
              {
                !isGeneralSchoolUrbanSelected && (
                  <StyledTableCell sx={{fontSize: rowTotals[category] > 0 ? 15 : 14, color: rowTotals[category] <= 0 ? '#737373' : '#000'}}>{rowTotals[category]}</StyledTableCell>
                )
              }
              
            </StyledTableRow>
          ))}
      
            <StyledTableRow>
              <StyledTableCell sx={{textAlign: 'right'}}>{t('summary.total')}</StyledTableCell>
              {Object.values(data)[0].map((item: DashboardResultItem) => (
                <TableCell key={item.key}>{colTotals[item.key]}</TableCell>
              ))}
              {
                !isGeneralSchoolUrbanSelected && (
                  <StyledTableCell sx={{fontSize: overallTotal > 0 ? 15 : 14, color: overallTotal <= 0 ? '#737373' : '#000'}}>{overallTotal}</StyledTableCell>
                )
              }
            </StyledTableRow>

        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DashboardTable;