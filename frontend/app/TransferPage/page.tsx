"use client";

import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
//   DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image'
import Navbar from '@/components/Navbar';
import axios from 'axios';

// Types
type Merchant = {
  id: string;
  name: string;
  logo: string;
  description: string;
  location: string;
  category: string;
};

type PaymentHistory = {
  id: string;
  recipient: string;
  amount: number;
  date: string;
  type: 'merchant' | 'student';
  status: 'completed' | 'pending' | 'failed';
};

const CoinTransferPage = () => {
  // Sample merchant data
  const merchants: Merchant[] = [
    {
      id: '1',
      name: 'Campus Cafe',
      logo: 'https://unipay7781.s3.us-east-1.amazonaws.com/biriyani.png',
      description: 'College cafeteria serving fresh meals',
      location: 'Main Building',
      category: 'Food',
    },
    {
      id: '2',
      name: 'College Bookstore',
      logo: 'https://unipay7781.s3.us-east-1.amazonaws.com/stationary.png',
      description: 'Academic books and supplies',
      location: 'Library Block',
      category: 'Education',
    },
    // Add more merchants as needed
  ];

  // Sample payment history
  const [paymentHistory] = useState<PaymentHistory[]>([
    {
      id: '1',
      recipient: 'Campus Cafe',
      amount: 5,
      date: '2025-02-20',
      type: 'merchant',
      status: 'completed',
    },
    {
      id: '2',
      recipient: 'John Doe',
      amount: 3,
      date: '2025-02-19',
      type: 'student',
      status: 'completed',
    },
  ]);

  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [hoveredMerchant, setHoveredMerchant] = useState<Merchant | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [paymentAmount, setPaymentAmount] = useState('');
  const [studentId, setStudentId] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentType, setPaymentType] = useState<'merchant' | 'student' | null>(null);

  const handleMerchantHover = (merchant: Merchant, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY
    });
    setHoveredMerchant(merchant);
  };

  const handlePayment = () => {
    setShowConfirmation(true);
  };

  const confirmPayment = () => {
    handleStudentPayment();
    setShowConfirmation(false);
    setSelectedMerchant(null);
    setPaymentAmount('');
    setStudentId('');
    setPaymentType(null);
  };

  const handleStudentPayment = async () => {
    try {
      const senderUsername = "sudharshan";
      const amount = parseInt(paymentAmount, 10); // Ensure base 10 parsing
  
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
      }
  
      const response = await axios.post("http://localhost:5001/api/users/transfer", {
        senderUsername,
        receiverUsername: studentId,
        amount, 
      });
  
      alert(JSON.stringify(response.data.message));
    } catch (error: any) {
      console.error(error);
    }
  };
  
  

const x = hoverPosition;
console.log(x);

  return (
    <>
    <Navbar selectedMenuItem="Transfer" />
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-black mb-8">UniCoin Transfer</h1>
      
      {/* QR Scanner Button */}
      <div className="mb-8">
        <Button 
          className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
          onClick={() => {/* Implement QR scanning */}}
        >
          <Camera size={20} />
          Scan QR Code
        </Button>
      </div>

      {/* Merchants Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-black mb-4">Available Merchants</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            <div className='flex'>
          {merchants.map((merchant) => (
            <div key={merchant.id} className="relative">
              <div
                className="w-16 h-16 cursor-pointer relative m-5"
                onMouseEnter={(e) => handleMerchantHover(merchant, e)}
                onMouseLeave={() => setHoveredMerchant(null)}
                onClick={() => {
                  setSelectedMerchant(merchant);
                  setPaymentType('merchant');
                }}
              >
                <Image
                  src={merchant.logo}
                  alt={merchant.name}
                  width={10}
                  height={64}
                  className="w-full h-full rounded-full transition-transform hover:scale-105"
                />
              </div>

              {/* Hover Details Popup */}
              {hoveredMerchant?.id === merchant.id && (
                <div 
                  className="absolute z-50 bg-white shadow-lg rounded-lg p-4 w-100"
                  style={{
                    top: '100%',
                    left: '180%',
                    transform: 'translateX(-50%)',
                    marginTop: '0.5rem'
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-lg">{merchant.name}</h3>
                    <p className="text-sm text-gray-600">{merchant.description}</p>
                    <div className="text-sm">
                      <p><span className="font-medium">Location:</span> {merchant.location}</p>
                      <p><span className="font-medium">Category:</span> {merchant.category}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Student Payment Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-black mb-4">Pay to Student</h2>
        <Card className="max-w-md">
          <CardContent className="p-4">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter Student College ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
              <Button 
                className="w-full bg-black text-white hover:bg-gray-800"
                onClick={() =>  setPaymentType("student")}
              >
                Proceed
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Payment Dialog */}
      <Dialog open={paymentType !== null} onOpenChange={() => setPaymentType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Payment to {paymentType === 'merchant' ? selectedMerchant?.name : 'Student'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Enter number of UniCoins"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
            <p className="text-sm text-gray-600">
              1 UniCoin = 10 INR
            </p>
            <Button 
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={handlePayment}
            >
              Pay
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to transfer {paymentAmount} UniCoins to{' '}
              {paymentType === 'merchant' ? selectedMerchant?.name : `Student (${studentId})`}?
            </p>
            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-gray-200 text-black hover:bg-gray-300"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-black text-white hover:bg-gray-800"
                onClick={confirmPayment}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment History */}
      <section>
        <h2 className="text-2xl font-semibold text-black mb-4">Payment History</h2>
        <div className="space-y-4">
          {paymentHistory.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{payment.recipient}</p>
                    <p className="text-sm text-gray-600">
                      {payment.type === 'merchant' ? 'Merchant Payment' : 'Student Transfer'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{payment.amount} UniCoins</p>
                    <p className="text-sm text-gray-600">{payment.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
    </>
  );
};

export default CoinTransferPage;