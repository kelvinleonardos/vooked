import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Appnavbar from '../compunents/navbar';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import useUserAuth from '../utils/useAuth';
import '../distcss/restoDetail.css';
import image1 from '../img/1.jpeg';
import image2 from '../img/2.jpeg';
import image3 from '../img/3.jpeg';
import image4 from '../img/4.jpeg';
import image5 from '../img/5.jpeg';
import image6 from '../img/6.jpeg';
import imagee from '../img/services.png';
import makan from '../img/makanan.jpeg';
import makanbg from '../img/bgmakan.jpeg';
import kursina1 from '../img/kursi1.jpeg';
import kursina2 from '../img/kursi2.jpeg';
import kursina3 from '../img/kursi3.jpeg';
import kursina4 from '../img/kursi4.jpeg';
import kursina5 from '../img/kursi5.jpeg';

const Tables = () => {
  useUserAuth();
  const [tables, setTables] = useState([]);
  const [status, setStatus] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const { resto_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const restaurant = location.state.restaurant;

  useEffect(() => {
    fetchTable();
    fetchMenu();
  }, []); 

  const images = [image1, image2, image3, image4, image5, image6];
  const kursi1 = kursina1;
  const kursi2 = kursina2;
  const kursi3 = kursina3;
  const kursi4 = kursina4;
  const fotomakan = makan;
  const fotomakanbg = makanbg;
  const kursi5 = kursina5;

  const fetchTable = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/tableresto/${resto_id}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setTables(response.data);
        response.data.forEach(table => fetchStatus(table.table_id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStatus = async (table_id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/tablestatus/${resto_id}/${table_id}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setStatus(prevStatus => ({
          ...prevStatus,
          [table_id]: response.data
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/menu?restaurant_id=${resto_id}`, {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });
      if (response.status === 200) {
        setMenuItems(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBook = (table_id) => {
    try {
      navigate(`/table/${resto_id}/${table_id}`);
    } catch (error) {
      console.error('Table failed!', error);
    }
  };

  return (
    <div>
      <Appnavbar />
      
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', margin: '20px' }}>
        <h1 style={{ fontFamily: 'Cursive', fontSize: '30px', fontWeight: 'bold' }}>Our Restaurant</h1>
        <hr style={{ backgroundColor: 'orange', height: '3px', border: 'none' }}></hr>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ marginRight: '20px' }}>
            <img src={images[(resto_id - 1) % images.length]} alt="Restaurant Image" width="480" height="270" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'Josefin Sans' }}>{restaurant.nama_restoran}</h2>
            <p style={{ fontFamily: 'Josefin Sans' }}>{restaurant.alamat}</p>
          </div>
        </div>
        
        <Tabs defaultActiveKey="tables" id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="tables" title="Table List">
            <h2 style={{ fontFamily: 'Cursive', fontSize: '30px', fontWeight: 'bold', marginTop: '15px' }}>Table List</h2>
            <hr style={{ backgroundColor: 'orange', height: '3px', border: 'none' }}></hr>
            <div className="card-container">
  {tables.map((table, index) => (
    <Card key={table.table_id} className="card">
      <Card.Img variant="top" src={table.kapasitas === 1 ? kursi1 : table.kapasitas === 2 ? kursi2 : table.kapasitas === 3 ? kursi3 : table.kapasitas === 4 ? kursi4 : kursi5} className="card-img-top" />
      <Card.Body className="card-body">
        <Card.Title className="card-title">Nomor Meja: {table.nomor_meja}</Card.Title>
        <Card.Text className="card-text">
          Kapasitas: {table.kapasitas}<br />
          Status: {status[table.table_id] === 0 ? 'Available' : 'Unavailable'}
        </Card.Text>
        <Button
          variant={status[table.table_id] === 0 ? "primary" : "danger"}
          disabled={status[table.table_id] !== 0}
          onClick={() => handleBook(table.table_id)}
          className={status[table.table_id] === 0 ? "view-menu-button" : "btn-disabled"}
        >
          {status[table.table_id] === 0 ? "Book Now" : "ALREADY BOOKED"}
        </Button>
      </Card.Body>
    </Card>
  ))}
</div>
          </Tab>
          <Tab eventKey="menu" title="Menu">
  <h2 style={{ fontFamily: 'Cursive', fontSize: '30px', fontWeight: 'bold', marginTop: '15px' }}>Menu</h2>
  <hr style={{ backgroundColor: 'orange', height: '3px', border: 'none' }}></hr>
  <div className="card-container">
    {menuItems.map((menuItem, index) => (
      <Card key={menuItem.menu_id} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', background: 'white' }}>
        <Card.Img variant="top" src={fotomakan} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
        <Card.Body className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Card.Title className="card-title" style={{ margin: '10px 0' }}>{menuItem.nama_menu}</Card.Title>
          <Card.Text className="card-text" style={{ textAlign: 'center' }}>
            {menuItem.deskripsi}
          </Card.Text>
          <div style={{ backgroundColor: '#E0E0E0', borderRadius: '20px', padding: '5px 20px', color: '#6200EA', fontWeight: 'bold', marginTop: '10px' }}>
            Rp {menuItem.harga}
          </div>
        </Card.Body>
      </Card>
    ))}
  </div>
</Tab>
        </Tabs>
      </div>

      <footer style={{ bottom: '0', width: '100%' }}>
        <img src={imagee} alt="Footer" style={{ width: '100%' }} />
      </footer>
    </div>
  );
};

export default Tables;
