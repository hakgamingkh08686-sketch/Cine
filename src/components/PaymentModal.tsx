import React, { useState } from 'react';
import { Series, CreatorSettings, Order } from '../types';
import { X, QrCode, CheckCircle2, Upload, ShieldCheck, Smartphone, AlertCircle, Loader2 } from 'lucide-react';
import { KHQRCode } from './KHQRCode';

interface PaymentModalProps {
  series: Series | null;
  creatorSettings: CreatorSettings;
  onClose: () => void;
  onPaymentSuccess: (order: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  series,
  creatorSettings,
  onClose,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<'QR' | 'VERIFYING' | 'SUCCESS'>('QR');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'KHQR' | 'ABA' | 'ACLEDA' | 'Bakong'>('KHQR');
  const [slipFile, setSlipFile] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!series) return null;

  const priceKHR = Math.round(series.price * 4100);

  const handleSimulatePayment = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('សូមបញ្ចូលឈ្មោះ និងលេខទូរសព្ទរបស់អ្នកជាមុនសិន។');
      return;
    }
    setErrorMsg('');
    setStep('VERIFYING');

    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        seriesId: series.id,
        seriesTitle: series.title,
        amount: series.price,
        currency: 'USD',
        paymentMethod,
        customerPhone,
        customerName,
        status: 'COMPLETED',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        slipImage: slipFile || undefined,
      };
      setStep('SUCCESS');
      setTimeout(() => {
        onPaymentSuccess(newOrder);
      }, 1500);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSlipFile(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-500 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ទូទាត់ប្រាក់តាម QR Code</h3>
              <p className="text-xs text-slate-400">ដោះសោររឿង: {series.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {step === 'QR' && (
            <>
              {/* Price summary */}
              <div className="bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-900/40 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-rose-300 font-medium">ទឹកប្រាក់សរុប (Total Amount)</span>
                  <div className="text-2xl font-black text-white mt-0.5">
                    ${series.price.toFixed(2)} <span className="text-sm font-normal text-slate-300">({priceKHR.toLocaleString()}៛)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/30">
                    ដោះសោរគ្រប់ភាគ (១២+ ភាគ)
                  </span>
                </div>
              </div>

              {/* QR Image Box */}
              <div className="flex flex-col items-center justify-center bg-white p-5 rounded-2xl shadow-inner">
                <KHQRCode creatorSettings={creatorSettings} className="w-48 h-48" amount={series.price} />
                <div className="text-center mt-3">
                  <p className="text-xs font-bold text-slate-900">{creatorSettings.bankName}</p>
                  <p className="text-xs text-slate-600 font-mono">ឈ្មោះ: {creatorSettings.accountName}</p>
                  <p className="text-xs text-slate-600 font-mono">លេខគណនី: {creatorSettings.accountNumber}</p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">ជ្រើសរើសកម្មវិធីទូទាត់៖</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['KHQR', 'ABA', 'ACLEDA', 'Bakong'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        paymentMethod === m
                          ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">ឈ្មោះរបស់អ្នក (Customer Name)</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="ឧ. សុខ ចាន់ដារ៉ា"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">លេខទូរសព្ទ (Phone Number)</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="ឧ. 012 345 678"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">បញ្ជាក់វិក្កយបត្រ (Upload Slip - Optional)</label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-300 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-rose-400" />
                      <span>{slipFile ? 'បានបញ្ចូលរូបភាពរួចរាល់ ✅' : 'ជ្រើសរើសរូបភាព Slip'}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-rose-500/20 border border-rose-500/50 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action */}
              <button
                onClick={handleSimulatePayment}
                className="w-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>បញ្ជាក់ការទូទាត់រួចរាល់ (Confirm Payment)</span>
              </button>
            </>
          )}

          {step === 'VERIFYING' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
              <h4 className="text-lg font-bold text-white">កំពុងផ្ទៀងផ្ទាត់ការទូទាត់របស់អ្នក...</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                ប្រព័ន្ធកំពុងពិនិត្យប្រតិបត្តិការ QR Code ជាមួយធនាគារ សូមរង់ចាំបន្តិច...
              </p>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-white">ទូទាត់ជោគជ័យ!</h4>
              <p className="text-sm text-slate-300 max-w-xs">
                រឿងភាគ <strong className="text-rose-400">{series.title}</strong> ត្រូវបានដោះសោរជូនលោកអ្នករួចរាល់ហើយ។ សូមរីករាយទស្សនា!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
