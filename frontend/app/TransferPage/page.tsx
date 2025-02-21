

"use client";

import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import axios from 'axios';

// Types
type Business = {
  _id: string;
  businessName: string;
  category: string;
  phoneNumber: string;
  description: string;
  coins: number;
};

export default function CoinTransferPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [hoveredBusiness, setHoveredBusiness] = useState<Business | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentType, setPaymentType] = useState<'business' | 'student' | null>(null);
  const [studentId, setStudentId] = useState('');

  // Fetch businesses
  useEffect(() => {
    axios.get("http://localhost:5001/businesses")
      .then(response => {
        setBusinesses(response.data);
      })
      .catch(error => {
        console.error("Error fetching businesses:", error);
      });
  }, []);

  const handlePayment = () => {
    setShowConfirmation(true);
  };

  const confirmPayment = async () => {
    try {
      const senderUsername = localStorage.getItem("username");
      const amount = parseInt(paymentAmount, 10);
  
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
      }

      
      if(paymentType === 'business') {
        const response = await axios.post("http://localhost:5001/api/users//transferBusiness", {
          username: senderUsername,
          businessPhoneNumber: selectedBusiness.phoneNumber,
          amount: parseInt(paymentAmount)
        })
        alert(JSON.stringify(response.data.message));
      }
      else {
        const response = await axios.post("http://localhost:5001/api/users/transfer", {
          senderUsername,
          receiverUsername: studentId,
          amount,
        });
        alert(JSON.stringify(response.data.message));
      }

    } catch (error: any) {

      alert(error);
    } finally {
      setShowConfirmation(false);
      setSelectedBusiness(null);
      setPaymentAmount('');
      setStudentId('');
      setPaymentType(null);
    }
  };

  return (
    <>
      <Navbar selectedMenuItem="Transfer" />
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-4xl font-bold text-black mb-8">UniCoin Transfer</h1>

        {/* QR Scanner Button */}
        <div className="mb-8">
          <Button 
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
          >
            <Camera size={20} />
            Scan QR Code
          </Button>
        </div>

        {/* Businesses Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-black mb-4">Available Businesses</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {businesses.map((business) => (
              <div key={business._id} className="relative">
                <div
                  className="w-16 h-16 cursor-pointer relative m-5"
                  onMouseEnter={() => setHoveredBusiness(business)}
                  onMouseLeave={() => setHoveredBusiness(null)}
                  onClick={() => {
                    setSelectedBusiness(business);
                    setPaymentType('business');
                  }}
                >
                  <Image
                    src="https://unipay7781.s3.us-east-1.amazonaws.com/biriyani.png" // Replace with actual logo if available
                    alt={business.businessName}
                    width={64}
                    height={64}
                    className="w-full h-full rounded-full transition-transform hover:scale-105"
                  />
                </div>

                {/* Hover Details Popup */}
                {hoveredBusiness?.businessName === business.businessName && (
                  <div 
                    className="absolute z-50 bg-white shadow-lg rounded-lg p-4 w-60"
                    style={{ top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '0.5rem' }}
                  >
                    <h3 className="font-semibold text-lg">{business.businessName}</h3>
                    <p className="text-sm text-gray-600">{business.description}</p>
                    <p className="text-sm"><span className="font-medium">Category:</span> {business.category}</p>
                  </div>
                )}
              </div>
            ))}
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
                  onClick={() => setPaymentType("student")}
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
                Payment to {paymentType === 'business' ? selectedBusiness?.businessName : 'Student'}
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
                {paymentType === 'business' ? selectedBusiness?.businessName : `Student (${studentId})`}?
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
      </div>
    </>
  );
};
