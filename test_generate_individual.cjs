const { BakongKHQR, khqrData, IndividualInfo } = require('bakong-khqr');

function generateSDKIndividual({ accountName, accountNumber, amount }) {
  const isDynamic = amount !== undefined && amount > 0;
  
  // Clean inputs
  const cleanedName = accountName.trim().toUpperCase().replace(/[^A-Z0-9 ]/g, '');
  
  // For ACLEDA personal, Bakong ID is accountNumber@aclb
  let bakongId = accountNumber.trim().replace(/\s/g, '');
  if (!bakongId.includes('@')) {
    bakongId = `${bakongId}@aclb`;
  }

  const optionalData = {
    currency: khqrData.currency.usd, // USD
    merchantCategoryCode: "5999",
  };

  if (isDynamic) {
    optionalData.amount = amount;
    // Expiration timestamp is required for dynamic amount QRs, set to 2 hours in future
    optionalData.expirationTimestamp = Date.now() + (120 * 60 * 1000); 
  }

  const individualInfo = new IndividualInfo(
    bakongId,
    cleanedName || 'HANG HAK',
    'Phnom Penh',
    optionalData
  );

  const khqr = new BakongKHQR();
  const response = khqr.generateIndividual(individualInfo);
  return response;
}

const response = generateSDKIndividual({
  accountName: 'HANG HAK',
  accountNumber: '015466210',
  amount: 1.50
});

console.log('SDK Response:', JSON.stringify(response, null, 2));
console.log('SDK Generated QR String Verification:', BakongKHQR.verify(response.data.qr));
