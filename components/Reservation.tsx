"use client";
import React, { useState, useEffect } from 'react';
import styles from './Reservation.module.css';

interface ReservationProps {
    selectedVehicle?: string;
    isModal?: boolean;
    onClose?: () => void;
}

export default function Reservation({ selectedVehicle, isModal, onClose }: ReservationProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: 'Airport Transfer',
        vehicle: selectedVehicle || 'Executive Sedan',
        passengers: '1',
        bags: '1',
        pickupDate: '',
        pickupTime: '',
        pickupAddress: '',
        airline: '',
        flightNumber: '',
        destinationAddress: '',
        message: ''
    });

    useEffect(() => {
        if (selectedVehicle) {
            setFormData(prev => ({ ...prev, vehicle: selectedVehicle }));
        }
    }, [selectedVehicle]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', formData);
        alert('Thank you! Our team will contact you shortly to confirm your reservation.');
        if (onClose) onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const formContent = (
        <div className={`${styles.formWrapper} ${isModal ? styles.modalContent : ''}`}>
            {isModal && (
                <button className={styles.closeBtn} onClick={onClose}>&times;</button>
            )}
            <form onSubmit={handleSubmit}>
                <div className={styles.grid}>
                    {/* Passenger Information */}
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <h3 className={styles.formSubtitle}>Passenger Information</h3>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input type="text" name="name" placeholder="John Doe" required onChange={handleChange} value={formData.name} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input type="email" name="email" placeholder="john@example.com" required onChange={handleChange} value={formData.email} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <input type="tel" name="phone" placeholder="(416) 000-0000" required onChange={handleChange} value={formData.phone} />
                    </div>

                    {/* Trip Information */}
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <h3 className={styles.formSubtitle}>Trip Details</h3>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Service Type</label>
                        <select name="service" onChange={handleChange} value={formData.service}>
                            <option>Airport Transfer</option>
                            <option>Point to Point</option>
                            <option>Hourly / Charter</option>
                            <option>Wedding Service</option>
                            <option>Prom / Graduation</option>
                            <option>Corporate Event</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Vehicle Preference</label>
                        <select name="vehicle" onChange={handleChange} value={formData.vehicle}>
                            <option>Executive Sedan</option>
                            <option>Luxury SUV</option>
                            <option>Tesla Model S</option>
                            <option>Stretch Limousine</option>
                            <option>Mercedes Sprinter</option>
                            <option>SUV Stretch Limo</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Passengers</label>
                        <select name="passengers" onChange={handleChange} value={formData.passengers}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16].map(n => (
                                <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Luggage / Bags</label>
                        <select name="bags" onChange={handleChange} value={formData.bags}>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                <option key={n} value={n}>{n} {n === 1 ? 'Bag' : 'Bags'}</option>
                            ))}
                        </select>
                    </div>

                    {/* Schedule */}
                    <div className={styles.formGroup}>
                        <label>Pickup Date</label>
                        <input type="date" name="pickupDate" required onChange={handleChange} value={formData.pickupDate} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Pickup Time</label>
                        <input type="time" name="pickupTime" required onChange={handleChange} value={formData.pickupTime} />
                    </div>

                    {/* Pickup Location */}
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label>Pickup Address / Airport</label>
                        <input type="text" name="pickupAddress" placeholder="Enter address or airport code" required onChange={handleChange} value={formData.pickupAddress} />
                    </div>

                    {/* Airline / Flight info */}
                    <div className={styles.formGroup}>
                        <label>Airline (if airport)</label>
                        <input type="text" name="airline" placeholder="e.g. Air Canada" onChange={handleChange} value={formData.airline} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Flight Number</label>
                        <input type="text" name="flightNumber" placeholder="e.g. AC123" onChange={handleChange} value={formData.flightNumber} />
                    </div>

                    {/* Destination */}
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label>Destination Address</label>
                        <input type="text" name="destinationAddress" placeholder="Enter destination address" required onChange={handleChange} value={formData.destinationAddress} />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label>Special Instructions / Notes</label>
                        <textarea name="message" rows={3} placeholder="Additional requests..." onChange={handleChange} value={formData.message}></textarea>
                    </div>
                </div>
                <button type="submit" className={`btn-primary ${styles.submitBtn}`}>Confirm Reservation Request</button>
            </form>
        </div>
    );

    if (isModal) {
        return (
            <div className={styles.modalOverlay}>
                {formContent}
            </div>
        );
    }

    return (
        <section id="book" className={styles.reservation}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionSubtitle}>Reserve Now</span>
                    <h2 className={styles.sectionTitle}>Book Your Premium Experience</h2>
                </div>
                {formContent}
            </div>
        </section>
    );
}
