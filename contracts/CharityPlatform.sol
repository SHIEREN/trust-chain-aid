// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CharityPlatform
 * @dev 隐私保护的女性慈善捐助平台
 * @notice 本合约实现加密捐赠、身份验证、凭证管理和审计功能
 */
contract CharityPlatform {
    
    // ============ 结构体定义 ============
    
    struct Donation {
        address donor;              // 捐助人地址
        uint256 amount;             // 捐助金额
        uint256 timestamp;          // 捐助时间
        bytes32 encryptedData;      // 加密的捐助信息
        bool isActive;              // 是否激活
    }
    
    struct Beneficiary {
        address wallet;             // 受助人钱包地址
        bytes32 identityHash;       // 身份信息哈希
        bool isVerified;            // 是否已验证
        uint256 voucherBalance;     // 代金券余额
        uint256 registeredTime;     // 注册时间
    }
    
    struct Merchant {
        address wallet;             // 商户钱包地址
        string businessName;        // 商户名称
        bool isApproved;            // 是否已批准
        uint256 totalSales;         // 总销售额
    }
    
    struct Transaction {
        uint256 id;                 // 交易ID
        address beneficiary;        // 受助人地址
        address merchant;           // 商户地址
        uint256 amount;             // 交易金额
        bytes32 proofHash;          // 发货凭证哈希
        uint256 timestamp;          // 交易时间
        TransactionStatus status;   // 交易状态
        bool isChallenged;          // 是否被质疑
    }
    
    enum TransactionStatus {
        Pending,        // 待处理
        Completed,      // 已完成
        Challenged,     // 被质疑
        Refunded        // 已退款
    }
    
    enum Role {
        None,
        NGO,
        Auditor
    }
    
    // ============ 状态变量 ============
    
    address public owner;
    uint256 public totalDonations;
    uint256 public transactionCounter;
    
    mapping(address => Role) public roles;
    mapping(uint256 => Donation) public donations;
    mapping(address => Beneficiary) public beneficiaries;
    mapping(address => Merchant) public merchants;
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256[]) public beneficiaryTransactions;
    
    uint256 public donationCounter;
    
    // ============ 事件定义 ============
    
    event DonationReceived(uint256 indexed donationId, address indexed donor, uint256 amount);
    event BeneficiaryRegistered(address indexed beneficiary, bytes32 identityHash);
    event BeneficiaryVerified(address indexed beneficiary, address indexed ngo);
    event VoucherIssued(address indexed beneficiary, uint256 amount);
    event MerchantRegistered(address indexed merchant, string businessName);
    event MerchantApproved(address indexed merchant);
    event TransactionCreated(uint256 indexed txId, address indexed beneficiary, address indexed merchant, uint256 amount);
    event TransactionCompleted(uint256 indexed txId);
    event TransactionChallenged(uint256 indexed txId, address indexed auditor);
    event TransactionRefunded(uint256 indexed txId);
    event RoleGranted(address indexed account, Role role);
    
    // ============ 修饰符 ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier onlyNGO() {
        require(roles[msg.sender] == Role.NGO, "Only NGO can call this");
        _;
    }
    
    modifier onlyAuditor() {
        require(roles[msg.sender] == Role.Auditor, "Only Auditor can call this");
        _;
    }
    
    modifier onlyVerifiedBeneficiary() {
        require(beneficiaries[msg.sender].isVerified, "Beneficiary not verified");
        _;
    }
    
    modifier onlyApprovedMerchant() {
        require(merchants[msg.sender].isApproved, "Merchant not approved");
        _;
    }
    
    // ============ 构造函数 ============
    
    constructor() {
        owner = msg.sender;
        roles[msg.sender] = Role.NGO; // 部署者默认为NGO
    }
    
    // ============ 捐助人功能 ============
    
    /**
     * @dev 进行加密捐赠
     * @param _encryptedData 加密的捐赠信息（可包含留言等）
     */
    function donate(bytes32 _encryptedData) external payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        donationCounter++;
        donations[donationCounter] = Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            encryptedData: _encryptedData,
            isActive: true
        });
        
        totalDonations += msg.value;
        
        emit DonationReceived(donationCounter, msg.sender, msg.value);
    }
    
    // ============ 受助人功能 ============
    
    /**
     * @dev 受助人注册
     * @param _identityHash 身份信息的哈希值（保护隐私）
     */
    function registerBeneficiary(bytes32 _identityHash) external {
        require(beneficiaries[msg.sender].wallet == address(0), "Already registered");
        
        beneficiaries[msg.sender] = Beneficiary({
            wallet: msg.sender,
            identityHash: _identityHash,
            isVerified: false,
            voucherBalance: 0,
            registeredTime: block.timestamp
        });
        
        emit BeneficiaryRegistered(msg.sender, _identityHash);
    }
    
    /**
     * @dev 使用代金券进行交易
     * @param _merchant 商户地址
     * @param _amount 使用金额
     * @param _proofHash 购买凭证哈希
     */
    function useVoucher(address _merchant, uint256 _amount, bytes32 _proofHash) 
        external 
        onlyVerifiedBeneficiary 
    {
        require(merchants[_merchant].isApproved, "Merchant not approved");
        require(beneficiaries[msg.sender].voucherBalance >= _amount, "Insufficient voucher balance");
        
        beneficiaries[msg.sender].voucherBalance -= _amount;
        
        transactionCounter++;
        transactions[transactionCounter] = Transaction({
            id: transactionCounter,
            beneficiary: msg.sender,
            merchant: _merchant,
            amount: _amount,
            proofHash: _proofHash,
            timestamp: block.timestamp,
            status: TransactionStatus.Pending,
            isChallenged: false
        });
        
        beneficiaryTransactions[msg.sender].push(transactionCounter);
        
        emit TransactionCreated(transactionCounter, msg.sender, _merchant, _amount);
    }
    
    // ============ NGO 功能 ============
    
    /**
     * @dev NGO验证受助人身份
     * @param _beneficiary 受助人地址
     */
    function verifyBeneficiary(address _beneficiary) external onlyNGO {
        require(beneficiaries[_beneficiary].wallet != address(0), "Beneficiary not registered");
        require(!beneficiaries[_beneficiary].isVerified, "Already verified");
        
        beneficiaries[_beneficiary].isVerified = true;
        
        emit BeneficiaryVerified(_beneficiary, msg.sender);
    }
    
    /**
     * @dev NGO发放代金券
     * @param _beneficiary 受助人地址
     * @param _amount 代金券金额
     */
    function issueVoucher(address _beneficiary, uint256 _amount) external onlyNGO {
        require(beneficiaries[_beneficiary].isVerified, "Beneficiary not verified");
        require(address(this).balance >= _amount, "Insufficient contract balance");
        
        beneficiaries[_beneficiary].voucherBalance += _amount;
        
        emit VoucherIssued(_beneficiary, _amount);
    }
    
    /**
     * @dev NGO批准商户
     * @param _merchant 商户地址
     */
    function approveMerchant(address _merchant) external onlyNGO {
        require(merchants[_merchant].wallet != address(0), "Merchant not registered");
        require(!merchants[_merchant].isApproved, "Already approved");
        
        merchants[_merchant].isApproved = true;
        
        emit MerchantApproved(_merchant);
    }
    
    // ============ 商户功能 ============
    
    /**
     * @dev 商户注册
     * @param _businessName 商户名称
     */
    function registerMerchant(string memory _businessName) external {
        require(merchants[msg.sender].wallet == address(0), "Already registered");
        
        merchants[msg.sender] = Merchant({
            wallet: msg.sender,
            businessName: _businessName,
            isApproved: false,
            totalSales: 0
        });
        
        emit MerchantRegistered(msg.sender, _businessName);
    }
    
    /**
     * @dev 商户提交发货凭证并完成交易
     * @param _txId 交易ID
     * @param _deliveryProof 发货凭证哈希
     */
    function submitDeliveryProof(uint256 _txId, bytes32 _deliveryProof) 
        external 
        onlyApprovedMerchant 
    {
        Transaction storage txn = transactions[_txId];
        require(txn.merchant == msg.sender, "Not your transaction");
        require(txn.status == TransactionStatus.Pending, "Transaction not pending");
        
        txn.proofHash = _deliveryProof;
        txn.status = TransactionStatus.Completed;
        
        // 支付商户
        payable(msg.sender).transfer(txn.amount);
        merchants[msg.sender].totalSales += txn.amount;
        
        emit TransactionCompleted(_txId);
    }
    
    // ============ 审计员功能 ============
    
    /**
     * @dev 审计员质疑可疑交易
     * @param _txId 交易ID
     */
    function challengeTransaction(uint256 _txId) external onlyAuditor {
        Transaction storage txn = transactions[_txId];
        require(txn.status == TransactionStatus.Pending || txn.status == TransactionStatus.Completed, "Invalid transaction status");
        require(!txn.isChallenged, "Already challenged");
        
        txn.isChallenged = true;
        txn.status = TransactionStatus.Challenged;
        
        emit TransactionChallenged(_txId, msg.sender);
    }
    
    /**
     * @dev 审计员确认退款
     * @param _txId 交易ID
     */
    function refundTransaction(uint256 _txId) external onlyAuditor {
        Transaction storage txn = transactions[_txId];
        require(txn.status == TransactionStatus.Challenged, "Transaction not challenged");
        
        txn.status = TransactionStatus.Refunded;
        
        // 退回代金券给受助人
        beneficiaries[txn.beneficiary].voucherBalance += txn.amount;
        
        emit TransactionRefunded(_txId);
    }
    
    // ============ 管理员功能 ============
    
    /**
     * @dev 授予角色
     * @param _account 账户地址
     * @param _role 角色类型
     */
    function grantRole(address _account, Role _role) external onlyOwner {
        require(_role != Role.None, "Invalid role");
        roles[_account] = _role;
        emit RoleGranted(_account, _role);
    }
    
    // ============ 查询功能 ============
    
    function getDonation(uint256 _donationId) external view returns (Donation memory) {
        return donations[_donationId];
    }
    
    function getBeneficiary(address _beneficiary) external view returns (Beneficiary memory) {
        return beneficiaries[_beneficiary];
    }
    
    function getMerchant(address _merchant) external view returns (Merchant memory) {
        return merchants[_merchant];
    }
    
    function getTransaction(uint256 _txId) external view returns (Transaction memory) {
        return transactions[_txId];
    }
    
    function getBeneficiaryTransactions(address _beneficiary) external view returns (uint256[] memory) {
        return beneficiaryTransactions[_beneficiary];
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // 接收ETH
    receive() external payable {
        totalDonations += msg.value;
    }
}
