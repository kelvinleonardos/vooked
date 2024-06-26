import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import useAuth from '../utils/useAuth';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { format, addDays } from 'date-fns';
import Appnavbar from '../compunents/navbar';
import useUserAuth from '../utils/useUserAuth';
import '../distcss/booking.css';

const Tab = () => {
  useUserAuth();
  const [table, setTable] = useState({});
  const [formData, setFormData] = useState({
    jumlah_orang: '',
    tanggal_reservasi: format(new Date(), 'yyyy-MM-dd'),
    waktu_reservasi: '12:00:00',
    restaurant_id: '',
    table_id: '',
  });
  const [maxPengunjung, setMaxPengunjung] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [status, setStatus] = useState('');
  const { resto_id, table_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchStatus(table_id);
  }, []);

  useEffect(() => {
    if (formData.jumlah_orang === '' || Number(formData.jumlah_orang) <= 0 || Number(formData.jumlah_orang) > maxPengunjung) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [formData, maxPengunjung]);

  const fetchStatus = async (table_id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/tablestatus/${resto_id}/${table_id}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setStatus(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/table/${resto_id}/${table_id}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setTable(response.data);
        setMaxPengunjung(response.data.kapasitas);
        setFormData(prev => ({
          ...prev,
          restaurant_id: resto_id,
          table_id: table_id,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    console.log("stat = " + status)
    if (status == '1') {
      alert('Table is unavailable.');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/reservation', formData, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        console.log(response.data);
        navigate(`/`);
      } else {
        console.error('Failed to book table');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'jumlah_orang' && (value === '' || (Number(value) > 0 && Number(value) <= maxPengunjung))) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    } else if (name !== 'jumlah_orang') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const renderDateOptions = () => {
    const today = new Date();
    const dateOptions = [];
    for (let i = 0; i <= 7; i++) {
      const date = addDays(today, i);
      const formattedDate = format(date, 'yyyy-MM-dd');
      dateOptions.push(
        <option key={formattedDate} value={formattedDate}>
          {format(date, 'EEEE, dd MMMM yyyy')}
        </option>
      );
    }
    return dateOptions;
  };

  return (
    <div>
      <Appnavbar />
    <div className="booking-container" style={{ backgroundImage: `url(${require('../img/backgroundbook.png')})` }}>
            
      <div className="booking-form cormorant-font">
        <h2>Book your table now</h2>
        <Form onSubmit={handleBook}>
          <div className="form-group">
          <label className="form-label">Nomor Meja</label>
          <Form.Control
              type="text"
              name="nomor_meja"
              placeholder="Nomor Meja"
              className="form-control"
              value={table.nomor_meja}
              readOnly
            />
          </div>
          <div className="form-group">
          <label className="form-label">Kapasitas</label>
            <Form.Control
              type="text"
              name="kapasitas"
              placeholder="Kapasitas"
              className="form-control"
              value={table.kapasitas}
              readOnly
            />
          </div>
          <div className="form-group">
          <label className="form-label">Jumlah Pengunjung</label>
            <Form.Control
              type="number"
              name="jumlah_orang"
              placeholder="Person"
              className="form-control"
              value={formData.jumlah_orang}
              onChange={handleChange}
              min="1"
              max={maxPengunjung}
            />
          </div>
          <div className="form-group">
          <label className="form-label">Waktu</label>
            <Form.Control
              type="time"
              name="waktu_reservasi"
              placeholder="Timing"
              className="form-control"
              value={formData.waktu_reservasi}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
          <label className="form-label">Tanggal</label>
            <Form.Control
              as="select"
              name="tanggal_reservasi"
              className="form-control"
              value={formData.tanggal_reservasi}
              onChange={handleChange}
            >
              {renderDateOptions()}
            </Form.Control>
          </div>
          <Button type="submit" variant="primary" className="btn-primary" disabled={isButtonDisabled}>
            <strong>Book a Table</strong>
          </Button>
        </Form>
      </div>
    </div>
    </div>
  );
};

export default Tab;
     