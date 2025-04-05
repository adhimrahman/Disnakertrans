import React from 'react';
import Navbar from '../components/Navbar';
import HeaderLowongan from '../components/lapangan-kerja/HeaderLowongan';
import Footer from '../components/Footer';
import ContactHighlight from '../components/ContactHighlight';
import CardLowongan from '../components/lapangan-kerja/CardLowongan';

export default function page() {
  return (
    <>
    <Navbar />
    <HeaderLowongan />
    <CardLowongan />
    <ContactHighlight />
    <Footer />
    </>
  )
}
