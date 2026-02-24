"use client";
import React, { useState } from 'react';
import styles from './Reservation.module.css';

export default function Reservation() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: 'Airport Transfer',
        pickup: '',
        destination: '',
        date: '',
        time: '',
        passengers: '1',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data:', formData);
        alert('Thank you! Our team will contact you shortly to confirm your reservation.');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <section id="book" className={styles.reservation}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionSubtitle}>Reserve Now</span>
                    <h2 className={styles.sectionTitle}>Book Your Premium Experience</h2>
                </div>

                <div className={styles.formWrapper}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.grid}>
                            <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input type="text" name="name" placeholder="John Doe" required onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email Address</label>
                                <input type="email" name="email" placeholder="john@example.com" required onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Phone Number</label>
                                <input type="tel" name="phone" placeholder="(416) 000-0000" required onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Service Type</label>
                                <select name="service" onChange={handleChange}>
                                    <option>Airport Transfer</option>
                                    <option>Corporate Service</option>
                                    <option>Wedding Limo</option>
                                    <option>Night Out</option>
                                    <option>Casino Trip</option>
                                    <option>Prom/Graduation</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Pickup Location</label>
                                <input type="text" name="pickup" placeholder="Enter address or airport" required onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Destination</label>
                                <input type="text" name="destination" placeholder="Enter address or airport" required onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Date</label>
                                <input type="date" name="date" required onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Time</label>
                                <input type="time" name="time" required onChange={handleChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Number of Passengers</label>
                                <select name="passengers" onChange={handleChange}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14].map(n => (
                                        <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                <label>Additional Notes</label>
                                <textarea name="message" rows={4} placeholder="Special requests, flight number, etc." onChange={handleChange}></textarea>
                            </div>
                        </div>
                        <button type="submit" className={`btn-primary ${styles.submitBtn}`}>Confirm Reservation Request</button>
                    </form>
                </div>
            </div>
        </section>
    );
}
