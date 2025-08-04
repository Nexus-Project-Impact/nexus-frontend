import React from 'react';
import { PackageCard } from '../PackageCard';
import styles from './PackageGrid.module.css';

export function PackageGrid({ packages }) {
  return (
    <div className={styles.grid}>
      {packages.map((pkg) => (
        <PackageCard key={pkg.id} packageData={pkg} />
      ))}
    </div>
  );
}