"use client";
import React from 'react';
import styles from './Fleet.module.css';

const vehicles = [
    {
        name: "Executive Sedan",
        category: "Business Class",
        specs: { passengers: 3, luggage: 3 },
        description: "Elegant BMW 7 Series or Lincoln Continental for sophisticated city travel.",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Luxury SUV",
        category: "Elite Comfort",
        specs: { passengers: 6, luggage: 6 },
        description: "Cadillac Escalade or GMC Yukon XL offering spacious, premium travel.",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Tesla Model S",
        category: "Eco-Luxury",
        specs: { passengers: 3, luggage: 3 },
        description: "Zero-emission, silent, and cutting-edge luxury at our standard rates.",
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop"
    },
    {
        name: "Stretch Limousine",
        category: "Classic Luxury",
        specs: { passengers: 8, luggage: 4 },
        description: "The ultimate statement for weddings, proms, and gala events.",
        image: "https://images.unsplash.com/photo-1511210352396-54a060633c32?q=80&w=2114&auto=format&fit=crop"
    },
    {
        name: "Mercedes Sprinter",
        category: "Group Travel",
        specs: { passengers: 14, luggage: 14 },
        description: "Premium group transportation with ample space for luggage and comfort.",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "SUV Stretch Limo",
        category: "Party Elite",
        specs: { passengers: 16, luggage: 8 },
        description: "Massive presence and ultra-luxury interior for the biggest occasions.",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?q=80&w=2070&auto=format&fit=crop"
    }
];

export default function Fleet() {
    return (
        <section id="fleet" className={styles.fleet}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionSubtitle}>Our Collection</span>
                    <h2 className={styles.sectionTitle}>The Fleet Of Excellence</h2>
                </div>

                <div className={styles.grid}>
                    {vehicles.map((vehicle, index) => (
                        <div key={index} className={styles.vehicleCard}>
                            <div className={styles.imageWrapper}>
                                <img src={vehicle.image} alt={vehicle.name} className={styles.vehicleImage} />
                            </div>
                            <div className={styles.content}>
                                <span className={styles.category}>{vehicle.category}</span>
                                <h3 className={styles.name}>{vehicle.name}</h3>
                                <div className={styles.specs}>
                                    <div className={styles.specItem}>
                                        <span>👥</span> {vehicle.specs.passengers}
                                    </div>
                                    <div className={styles.specItem}>
                                        <span>🧳</span> {vehicle.specs.luggage}
                                    </div>
                                </div>
                                <p className={styles.description}>{vehicle.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
