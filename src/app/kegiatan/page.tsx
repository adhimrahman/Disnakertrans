import React from 'react'
import Navbar from '../components/Navbar';
import HeaderKegiatan from '../components/kegiatan/HeaderKegiatan';
import Footer from '../components/Footer';
import CardKegiatan from '../components/kegiatan/CardKegiatan';
import ContactHighlight from '../components/ContactHighlight';

export default function page() {
  return (
    <>
    <Navbar />
    <HeaderKegiatan />
    <CardKegiatan />
    <ContactHighlight />
    <Footer />
    </>
  )
}
