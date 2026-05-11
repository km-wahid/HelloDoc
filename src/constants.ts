import { Doctor } from './types';

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Ariful Islam',
    specialty: 'General Physician',
    qualifications: 'MBBS, FCPS',
    experience: '12+ Years Exp',
    hospital: 'Dhaka Medical',
    rating: 4.9,
    reviewCount: 120,
    isOnline: true,
    nextAvailable: 'Today, 04:30 PM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAl59doz73JlqC82Ba3uElGS2A7JBGI828n5d_EcvyWZ72XI2Q7z0ppMIYdWQyAOPv1XxlwAUzlsS-bFFgiFiNNZdPFXmbM16PP8hnfsM6ZFJwCKI9BWEY4GQUeyl6B-EDyyAPBOi4COL-tb7GE4aoROc1NUpG9PR4jnDDqlk6E3A6fhuFzku_swMcB0w2bC0zBBbckhJpahRtH7Z7JalVD3Jum8-kAiHefXnuZRFkKHXwfupkADuMET9REgTlAMvFoh4BNBRJU2w8'
  },
  {
    id: '2',
    name: 'Dr. Sarah Rahman',
    specialty: 'Gynecologist',
    qualifications: 'MD, DGO',
    experience: '8 Years Exp',
    hospital: 'Evercare Hospital',
    rating: 4.8,
    reviewCount: 85,
    isOnline: false,
    nextAvailable: 'Tomorrow, 10:00 AM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_KX8QtRq9542ve3l6qO4gi1ZQZtQGD-0YpY68SqbVt-wJjzn6ZvrX0WdGB-_1ZXs5CkLHP-avPy8pcYip5uqtCWIAwo4MvB3MnwYWLgdsVAtKfnwCBsQi3N5Gd4C_zbNo1hl6bi0UODbGgZzmfL62RZJOt5-1TDIDN_Uf85mDoV0lgT4VAxxkWRr98qa3Pi3pFZVh4URSSxDDEUHOxK-rMJ88uyahuI5ganeESTTuOtYGSac2uHf6lhOqzQ9YMCGvvPl_Tq5YJNU'
  }
];
