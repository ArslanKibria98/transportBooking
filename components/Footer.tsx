"use client";
import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <div className={styles.logo}>
                            <span className={styles.logoText}>TORONTO</span>
                            <span className={styles.logoAccent}>AIRPORT LIMO</span>
                        </div>
                        <p className={styles.brandDesc}>
                            Toronto's premier limousine and chauffeur service. Committed to providing
                            extraordinary travel experiences with our elite fleet and professional staff.
                        </p>
                    </div>

                    <div>
                        <h4 className={styles.colTitle}>Quick Links</h4>
                        <div className={styles.links}>
                            <Link href="#">Home</Link>
                            <Link href="#services">Services</Link>
                            <Link href="#fleet">Our Fleet</Link>
                            <Link href="#book">Reserve Online</Link>
                            <Link href="#about">About Us</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.colTitle}>Services</h4>
                        <div className={styles.links}>
                            <Link href="#">Airport Transfers</Link>
                            <Link href="#">Weddings</Link>
                            <Link href="#">Corporate</Link>
                            <Link href="#">Casino Trips</Link>
                            <Link href="#">Nights Out</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className={styles.colTitle}>Contact Us</h4>
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                <span className={styles.icon}>📍</span>
                                <span>456 Luxury Drive, Toronto, ON</span>
                            </div>
                            <div className={styles.contactItem}>
                                <span className={styles.icon}>📞</span>
                                <span>(416) 619-0050</span>
                            </div>
                            <div className={styles.contactItem}>
                                <span className={styles.icon}>✉️</span>
                                <span>info@torontoairportlimo.com</span>
                            </div>
                            <div className={styles.contactItem}>
                                <span className={styles.icon}>🕒</span>
                                <span>Available 24/7, 365 Days</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} Toronto Airport Limo. All rights reserved.</p>
                    <div className={styles.links} style={{ flexDirection: 'row', gap: '2rem' }}>
                        <Link href="#">Privacy Policy</Link>
                        <Link href="#">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
