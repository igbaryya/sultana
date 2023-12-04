/* eslint-disable */

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { Link } from 'react-router-dom';
import { EMPTY_YOUTH, RiskCharacteristics, YouthDetails } from 'interfaces/YouthObject';
import { t } from 'i18next';
import { ClassArrNamesMaps } from 'consts';
import { getInstance } from 'sdk';
import { utils as XLSXUtils, writeFile } from 'xlsx';
import SendIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import { currentUserSelector } from 'sdk/modules/login/loginSelector';
import { useSelector } from 'react-redux';

import '../styles.scss';
import { IconButton } from '@mui/material';
import DeleteConfirmationModal from 'pages/youth-details/components/ConfirmationModal';
import { toast } from 'react-toastify';
type Props = {
  searchResult: Record<string, YouthDetails>;
};
const { youthApi: { getLastTreatment, deleteYouth } } = getInstance();

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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



function createData(
  id: string,
  fbId: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  gender: string,
  parentName1: string,
  parentNumber1: string,
  parentName2: string,
  parentNumber2: string,
  hotelName: string,
  responsibleInstructor: string | undefined,
  lastAvailablityAtZoom: string | Date | number | undefined,
  lastAvailabilityAtVenture: string | Date | number | undefined,
  disconnected?: boolean,
  city?: string,
) {
  return {
    id,
    fbId,
    firstName,
    lastName,
    phoneNumber,
    gender,
    parentName1,
    parentNumber1,
    parentName2,
    parentNumber2,
    hotelName,
    responsibleInstructor,
    lastAvailablityAtZoom,
    lastAvailabilityAtVenture,
    disconnected,
    city
  };
}



export default function YouthSearchResult({ searchResult }: Props) {

  const handleDeleteYouth = async () => {
    if (deleteYouthId) {
      await deleteYouth(deleteYouthId);
    }
    setDeleteModalOpen(false);
    toast(t('dashboard.userDeletedSuccess'), { type: 'success', position: toast.POSITION.TOP_LEFT });
    window.location.reload();
  };

  const handleDeleteConfirmation = (youthId: string) => {
    setdeleteYouthId(youthId);
    setDeleteModalOpen(true);
   
  };

  const [isDeleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const userDetails = useSelector(currentUserSelector);

const [deleteYouthId, setdeleteYouthId] = React.useState('');
  const sortedKeys = Object.keys(searchResult).sort((key1, key2) => {
    const lastName1 = searchResult[key1] && searchResult[key1].lastName || '';
    const lastName2 = searchResult[key2] && searchResult[key2].lastName || '';
    return lastName1.localeCompare(lastName2, 'he', { sensitivity: 'base' });
  });
  const handleExportToExcel = async () => {
	const formattedRows = await Promise.all(sortedKeys.map(async (key: any) => {
	  const row: any = searchResult[key];
	  const lastTreatment = await getLastTreatment(key); // Assuming getLastTreatment is an async function
    const formattedRow =  {
		[t('youthDetails.ID')]: row.id,
		[t('youthDetails.FirstName')]: row.firstName,
		[t('youthDetails.LastName')]: row.lastName,
		[t('youthDetails.PhoneNumber')]: row.phoneNumber,
		[t('youthDetails.Gender')]: row.gender,
		[t('youthDetails.City')]: row.city,
		[t('youthDetails.hotelAddress')]: row.hotel.address,
		[t('youthDetails.HotelName')]: row.hotel.name,
		[t('youthDetails.school')]: row.school,
		[t('youthDetails.Class')]: ClassArrNamesMaps[row.class] || '',
		[t('youthDetails.ClassNumber')]: row.classNumber,
		[t('youthDetails.ParentName')]: row.parents[0]?.name,
		[t('youthDetails.ParentNumber')]: row.parents[0]?.phoneNumber,
		[t('youthDetails.ParentName')]: row.parents[1]?.name,
		[t('youthDetails.ParentNumber')]: row.parents[1]?.phoneNumber,
		[t('youthDetails.worry')]: row.lastWorry,
		[t('youthDetails.responsibleInstructor')]: row.responsibleInstructor,
    [t('youthDetails.lastTreatment')]: lastTreatment && lastTreatment.date ? new Date(lastTreatment.date) : 'NA', // Assuming lastTreatment is fetched asynchronously
  };
  Object.keys(EMPTY_YOUTH.riskCharacteristics).forEach((riskKey) => {
    const riskValue = row.riskCharacteristics?.[riskKey as keyof RiskCharacteristics];
    const formattedRiskValue = (riskValue === 'NA' || riskValue === 'No') ? t('youthDetails.No') : t('youthDetails.Yes');
    formattedRow[t(`youthDetails.${riskKey}`)] = riskValue ? formattedRiskValue : t('youthDetails.No');
  });


  return formattedRow;
	}));
  
	const sheet = XLSXUtils.json_to_sheet(formattedRows);
	const wb = XLSXUtils.book_new();
	XLSXUtils.book_append_sheet(wb, sheet, 'YouthData');
	writeFile(wb, 'youth_data.xlsx');
  };
  
  const rows = sortedKeys.map((fbId) => {
    const {
      firstName,
      lastName,
      phoneNumber,
      gender,
      parents,
      hotel,
      responsibleInstructor,
      disconnected,
      id,
      lastAvailablityAtZoom,
      lastAvailabilityAtVenture,
      city
    } = searchResult[fbId];
    const { name } = hotel;
    const [
      { name: parentName1, phoneNumber: parentNumber1 },
      { name: parentName2, phoneNumber: parentNumber2 },
    ] = parents;
    return createData(
      id,
      fbId,
      firstName,
      lastName,
      phoneNumber,
      gender,
      parentName1,
      parentNumber1,
      parentName2,
      parentNumber2,
      name,
      responsibleInstructor,
      lastAvailablityAtZoom,
      lastAvailabilityAtVenture,
      !!disconnected,
      city
    );
  });


  /* const isDatePastSevenDays = (date: Date): boolean => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return date < sevenDaysAgo;
  }; */

  /*const areDatesPastSevenDays = (
    lastAvailablityAtZoomValue: any,
    lastAvailabilityAtVentureValue: any,
  ): boolean => {
    const lastAvailablityAtZoom = lastAvailablityAtZoomValue ? new Date(lastAvailablityAtZoomValue) : null;
    const lastAvailabilityAtVenture = lastAvailabilityAtVentureValue
      ? new Date(lastAvailabilityAtVentureValue)
      : null;

    if (lastAvailablityAtZoom && lastAvailabilityAtVenture) {
      return (
        isDatePastSevenDays(lastAvailablityAtZoom) &&
        isDatePastSevenDays(lastAvailabilityAtVenture)
      );
    } else if (lastAvailablityAtZoom) {
      return isDatePastSevenDays(lastAvailablityAtZoom);
    } else if (lastAvailabilityAtVenture) {
      return isDatePastSevenDays(lastAvailabilityAtVenture);
    } else {
      return true; // Both dates are not populated
    }
  };*/

  // Pagination state
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <>
    <TableContainer component={Paper}>
		<Button onClick={handleExportToExcel} variant="contained" endIcon={<SendIcon style={{marginRight:'5px'}}/>}>
		  	 {t('dashboard.exportToExcel')}
		</Button>
		<br />
		<TablePagination
			rowsPerPageOptions={[5, 10, 25]}
			component="div"
			count={rows.length}
			rowsPerPage={rowsPerPage}
			page={page}
			onPageChange={handleChangePage}
			labelRowsPerPage={t('dashboard.rowsPerPageLabel')}
			onRowsPerPageChange={handleChangeRowsPerPage}
		/>
	
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">{t('dashboard.ID')} 

            </StyledTableCell>
            <StyledTableCell align="center">{t('dashboard.FirstName')}</StyledTableCell>
            <StyledTableCell align="center">{t('dashboard.LastName')}</StyledTableCell>
            <StyledTableCell sx={{minWidth: 100}} align="center">{t('dashboard.PhoneNumber')}</StyledTableCell>
            <StyledTableCell align="center">{t('dashboard.Gender')}</StyledTableCell>
            <StyledTableCell align="center">{t('dashboard.ParentName1')}</StyledTableCell>
            <StyledTableCell sx={{minWidth: 100}} align="center">{t('dashboard.ParentNumber1')}</StyledTableCell>
            <StyledTableCell align="center">{t('dashboard.ParentName2')}</StyledTableCell>
            <StyledTableCell sx={{minWidth: 100}} align="center">{t('dashboard.ParentNumber2')}</StyledTableCell>
            <StyledTableCell align="center">{t('dashboard.responsibleInstructor')}</StyledTableCell>
            <StyledTableCell align="center">{t('youthDetails.City')}</StyledTableCell>
            <StyledTableCell align="center">{t('dashboard.Disconnected')}</StyledTableCell>
						<StyledTableCell align="center">{t('dashboard.deleteYouth')}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => {
			return (
				<StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                <Link to={`/youthDetails/${row.fbId}`}>{row.id}</Link>
              </StyledTableCell>
              <StyledTableCell align="center">{row.firstName}</StyledTableCell>
              <StyledTableCell align="center">{row.lastName}</StyledTableCell>
              <StyledTableCell align="center"><a style={{color: '#000', textDecoration: 'none'}} href={`tel://${row.phoneNumber}`}>{row.phoneNumber}</a></StyledTableCell>
              <StyledTableCell align="center">{row.gender === 'M' ? t('youthDetails.Mail') : row.gender === 'F' ? t('youthDetails.Femail') : ''}</StyledTableCell>
              <StyledTableCell align="center">{row.parentName1}</StyledTableCell>
              <StyledTableCell align="center">{row.parentNumber1}</StyledTableCell>
              <StyledTableCell align="center">{row.parentName2}</StyledTableCell>
              <StyledTableCell align="center">{row.parentNumber2}</StyledTableCell>
              <StyledTableCell align="center">{!row.responsibleInstructor || row.responsibleInstructor === '' || row.responsibleInstructor === 'NA' ? t(`youthDetails.noInstructor`) : row.responsibleInstructor}</StyledTableCell>
              <StyledTableCell align="center">{row.city || '--'}</StyledTableCell>
              <StyledTableCell align="center">
                {row.disconnected/* areDatesPastSevenDays(row.lastAvailablityAtZoom, row.lastAvailabilityAtVenture )*/
                  ? t('dashboard.yes')
                  : t('dashboard.no')}
              </StyledTableCell>
              <StyledTableCell align="center">
										<IconButton
												style={{
												color: !userDetails?.isAdmin && !userDetails?.isGuide ? 'grey' : 'black'  
												}}
												disabled={!userDetails?.isAdmin && !userDetails?.isGuide}
												onClick={() => handleDeleteConfirmation(row.fbId)}
											>
												<DeleteIcon />
											</IconButton>
										</StyledTableCell>
            </StyledTableRow>
			)
		  }
			
            
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <DeleteConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={() => setDeleteModalOpen(false)}
    onConfirm={handleDeleteYouth}
    confirmLabel={t('dashboard.deleteYouth')}
  />
  </>
  );
}
