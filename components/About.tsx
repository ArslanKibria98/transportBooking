"use client";
import React from 'react';
import styles from './About.module.css';

export default function About() {
    return (
        <section id="about" className={styles.about}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.imageWrapper}>
                        <img
                            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
                            alt="Professional Chauffeur"
                            className={styles.aboutImage}
                        />
                    </div>
                    <div className={styles.content}>
                        <span className={styles.subtitle}>Our Legacy</span>
                        <h2 className={styles.title}>Defining Luxury Travel In Toronto</h2>
                        <p className={styles.description}>
                            For over a decade, Toronto Airport Limo has been the premier choice for discerning travelers
                            seeking more than just a ride. We provide a sanctuary of comfort and a standard of
                            professionalism that remains unmatched.
                        </p>
                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <span className={styles.featureTitle}>Vetted Chauffeurs</span>
                                <p className={styles.featureDesc}>Highly trained professionals committed to your safety and discretion.</p>
                            </div>
                            <div className={styles.feature}>
                                <span className={styles.featureTitle}>Pristine Fleet</span>
                                <p className={styles.featureDesc}>Latest luxury models, meticulously maintained for every journey.</p>
                            </div>
                            <div className={styles.feature}>
                                <span className={styles.featureTitle}>Tailored Service</span>
                                <p className={styles.featureDesc}>From route preferences to on-board amenities, we cater to your requests.</p>
                            </div>
                            <div className={styles.feature}>
                                <span className={styles.featureTitle}>Global Standards</span>
                                <p className={styles.featureDesc}>Local expertise with the quality of international luxury standards.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
