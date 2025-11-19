// 部署合约后，将合约地址填入这里
export const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // 替换为你的合约地址

// 从 contracts/CharityPlatform.sol 编译后获取的 ABI
export const CONTRACT_ABI = [
  "function donate(bytes32 encryptedData) external payable",
  "function registerBeneficiary(bytes32 identityHash) external",
  "function verifyBeneficiary(address beneficiary) external",
  "function issueVoucher(address beneficiary, uint256 amount) external",
  "function useVoucher(address merchant, uint256 amount, string memory itemDescription) external",
  "function registerMerchant() external",
  "function approveMerchant(address merchant) external",
  "function submitDeliveryProof(uint256 transactionId, string memory proofHash) external",
  "function challengeTransaction(uint256 transactionId, string memory reason) external",
  "function refundTransaction(uint256 transactionId) external",
  "function grantRole(address user, uint8 role) external",
  "function getDonation(uint256 donationId) external view returns (address donor, uint256 amount, bytes32 encryptedData, uint256 timestamp)",
  "function getBeneficiary(address beneficiary) external view returns (bytes32 identityHash, uint256 voucherBalance, bool isVerified, uint256 registeredAt)",
  "function getMerchant(address merchant) external view returns (bool isApproved, uint256 totalTransactions, uint256 registeredAt)",
  "function getTransaction(uint256 transactionId) external view returns (address beneficiary, address merchant, uint256 amount, string memory itemDescription, string memory deliveryProofHash, uint8 status, uint256 timestamp)",
  "function totalDonations() external view returns (uint256)",
  "function donationCount() external view returns (uint256)",
  "function transactionCount() external view returns (uint256)",
  "function getContractBalance() external view returns (uint256)",
  "event DonationReceived(uint256 indexed donationId, address indexed donor, uint256 amount, uint256 timestamp)",
  "event BeneficiaryRegistered(address indexed beneficiary, uint256 timestamp)",
  "event BeneficiaryVerified(address indexed beneficiary, uint256 timestamp)",
  "event VoucherIssued(address indexed beneficiary, uint256 amount, uint256 timestamp)",
  "event MerchantRegistered(address indexed merchant, uint256 timestamp)",
  "event MerchantApproved(address indexed merchant, uint256 timestamp)",
  "event TransactionCompleted(uint256 indexed transactionId, address indexed beneficiary, address indexed merchant, uint256 amount)",
  "event TransactionChallenged(uint256 indexed transactionId, address indexed auditor, string reason)",
  "event TransactionRefunded(uint256 indexed transactionId, address indexed beneficiary, uint256 amount)"
];
