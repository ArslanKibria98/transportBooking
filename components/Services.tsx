"use client";
import React from 'react';
import styles from './Services.module.css';

const services = [
    {
        title: "Airport Transfers",
        description: "Punctual and stress-free rides to and from Pearson International, Billy Bishop, and more.",
        icon: "✈️",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Corporate Excellence",
        description: "Professional chauffeur services for executives and business travelers who value time and comfort.",
        icon: "💼",
        image: "https://images.unsplash.com/photo-1511210352396-54a060633c32?q=80&w=2114&auto=format&fit=crop"
    },
    {
        title: "Weddings & Galas",
        description: "Make your special day unforgettable with our elegant stretch limousines and premium service.",
        icon: "💍",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Night on the Town",
        description: "Safe, luxury transportation for parties, concerts, and sporting events throughout Toronto.",
        icon: "🌃",
        image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Casino Expeditions",
        description: "Unmatched style for your trips to Fallsview, Casino Rama, and other regional hotspots.",
        icon: "🎰",
        image: "https://images.unsplash.com/photo-1596838132731-160100f3c58a?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Special Ocassions",
        description: "Proms, birthdays, and anniversaries—we provide the perfect ride for every milestone.",
        icon: "✨",
        image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop"
    },
];

export default function Services() {
    return (
        <section id="services" className={styles.services}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionSubtitle}>Premium Offerings</span>
                    <h2 className={styles.sectionTitle}>Tailored Luxury For Every Need</h2>
                </div>

                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <div key={index} className={styles.card}>
                            <img src={service.image} alt={service.title} className={styles.cardImage} />
                            <div className={styles.cardOverlay}>
                                <div className={styles.cardIcon}>{service.icon}</div>
                                <h3 className={styles.cardTitle}>{service.title}</h3>
                                <p className={styles.cardDescription}>{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
