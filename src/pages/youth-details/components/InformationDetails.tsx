/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { YouthDetails } from 'interfaces/YouthObject';
import { CssBaseline, Container } from '@mui/material';
import BarChartComponent from './graphs/BarChart';
import LineChartComponent from './graphs/LineChart';
import PieChartComponent from './graphs/PieChart';
import { getInstance } from 'sdk';
import './graphs/styles.scss';

interface Props {
  youthDetails: YouthDetails;
  id: string;
}

const { youthApi: { getArrivalStatusForUID, getTreatmentDataForUID } } = getInstance();

export default function InformationDetails(props: Props) {
  const { youthDetails, id } = props;
  const [arrivalStatusData, setArrivalStatusData] = useState<{ date: string; arrived: boolean }[]>([]);
  const [treatmentData, setTreatmentData] = useState<{ date: string; rate: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (youthDetails.school && youthDetails.class && id) {
        const arrivalData = await getArrivalStatusForUID(youthDetails.school, youthDetails.class, youthDetails.classNumber, id);
        setArrivalStatusData(arrivalData);
      }

      const treatmentData = await getTreatmentDataForUID(id);
      setTreatmentData(treatmentData);
    };

    fetchData();  
  }, [id, youthDetails]);

  const localizeDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'long', // Add this line to include the full day name
      timeZone: 'UTC', // Adjust options based on your preference
    };
    return date.toLocaleDateString('he-IL', options); // 'he-IL' is the locale code for Hebrew (Israel)
  };
  console.log(localizeDate);

  const get30DaysAgo = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return thirtyDaysAgo;
  };

  const isDateWithinLast30Days = (dateString: string) => {
    const date = new Date(dateString);
    const thirtyDaysAgo = get30DaysAgo();
    return date >= thirtyDaysAgo;
  };

  const arrivalStatusDataLocalized = arrivalStatusData
    .filter((item) => isDateWithinLast30Days(item.date))
    .map((item) => ({
      ...item,
      date: (item.date),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const treatmentDataLocalized = treatmentData
    .filter((item) => isDateWithinLast30Days(item.date))
    .map((item) => ({
      ...item,
      date: (item.date),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <CssBaseline>
      <Container maxWidth="md" className="charts-container">
	   
        <div className="grid-container">
          {arrivalStatusDataLocalized && arrivalStatusDataLocalized.length > 0 ? (
            <div className="chart-item">
			  <h3>נוכחות</h3>
              <BarChartComponent data={arrivalStatusDataLocalized} />
            </div>
          ) : null}
          {arrivalStatusData && arrivalStatusData.length > 0 ? (
            <div className="chart-item">
              <PieChartComponent data={arrivalStatusData} />
            </div>
          ) : null}
          {treatmentDataLocalized && treatmentDataLocalized.length > 0 ? (
			  <>
             	
				<div className="chart-item">
				<h3>רמת דאגה</h3>
				<LineChartComponent data={treatmentDataLocalized} />
				</div>
			</>
          ) : null}
        </div>
      </Container>
    </CssBaseline>
  );
}
