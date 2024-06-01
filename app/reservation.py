from flask import Blueprint, request, jsonify
from .config import Session
from .models import Reservation, Table
from .auth import token_required
from datetime import datetime

reservation_bp = Blueprint('reservation', __name__)


@reservation_bp.route('/reservation', methods=['POST'])
@token_required
def make_reservation(current_user):
    data = request.get_json()
    session = Session()
    new_reservation = Reservation(
        user_id=current_user.user_id,
        restaurant_id=data['restaurant_id'],
        table_id=data['table_id'],
        tanggal_reservasi=datetime.strptime(data['tanggal_reservasi'], '%Y-%m-%d'),
        waktu_reservasi=datetime.strptime(data['waktu_reservasi'], '%H:%M:%S'),
        jumlah_orang=data['jumlah_orang']
    )
    session.add(new_reservation)
    session.commit()
    session.close()
    return jsonify({'message': 'Reservation made!'})


@reservation_bp.route('/reservation', methods=['GET'])
@token_required
def get_reservations(current_user):
    session = Session()
    reservations = session.query(Reservation).filter_by(user_id=current_user.user_id).all()
    session.close()
    return jsonify([{
        'reservation_id': res.reservation_id,
        'restaurant_id': res.restaurant_id,
        'table_id': res.table_id,
        'tanggal_reservasi': res.tanggal_reservasi.strftime('%Y-%m-%d'),
        'waktu_reservasi': res.waktu_reservasi.strftime('%H:%M:%S'),
        'jumlah_orang': res.jumlah_orang
    } for res in reservations])


@reservation_bp.route('/reservation/<int:reservation_id>', methods=['DELETE'])
@token_required
def delete_reservation(current_user, reservation_id):
    session = Session()
    reservation = session.query(Reservation).filter_by(reservation_id=reservation_id,
                                                       user_id=current_user.user_id).first()
    if not reservation:
        session.close()
        return jsonify({'message': 'Reservation not found!'}), 404
    session.delete(reservation)
    session.commit()
    session.close()
    return jsonify({'message': 'Reservation deleted!'})