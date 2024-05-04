// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// import { ByteHasher } from './helpers/ByteHasher.sol';
// import { IWorldID } from './interfaces/IWorldID.sol';


struct User {
	uint256 balance;
	uint256 lastWithdraw;
}

library ByteHasher {
	/// @dev Creates a keccak256 hash of a bytestring.
	/// @param value The bytestring to hash
	/// @return The hash of the specified value
	/// @dev `>> 8` makes sure that the result is included in our field
	function hashToField(bytes memory value) internal pure returns (uint256) {
		return uint256(keccak256(abi.encodePacked(value))) >> 8;
	}
}

interface IWorldID {
	/// @notice Reverts if the zero-knowledge proof is invalid.
	/// @param root The of the Merkle tree
	/// @param groupId The id of the Semaphore group
	/// @param signalHash A keccak256 hash of the Semaphore signal
	/// @param nullifierHash The nullifier hash
	/// @param externalNullifierHash A keccak256 hash of the external nullifier
	/// @param proof The zero-knowledge proof
	/// @dev  Note that a double-signaling check is not included here, and should be carried by the caller.
	function verifyProof(
		uint256 root,
		uint256 groupId,
		uint256 signalHash,
		uint256 nullifierHash,
		uint256 externalNullifierHash,
		uint256[8] calldata proof
	) external view;
}


contract Contract {
	using ByteHasher for bytes;
	address public owner;
	mapping(address => User) public userBalances;
	uint256 public poolAvailableBalance;
	address public admin;
	///////////////////////////////////////////////////////////////////////////////
	///                                  ERRORS                                ///
	//////////////////////////////////////////////////////////////////////////////

	/// @notice Thrown when attempting to reuse a nullifier
	error DuplicateNullifier(uint256 nullifierHash);

	/// @dev The World ID instance that will be used for verifying proofs
	IWorldID internal immutable worldId;

	/// @dev The contract's external nullifier hash
	uint256 internal immutable externalNullifier;

	/// @dev The World ID group ID (always 1)
	uint256 internal immutable groupId = 1;

	/// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
	mapping(uint256 => bool) internal nullifierHashes;

	/// @param nullifierHash The nullifier hash for the verified proof
	/// @dev A placeholder event that is emitted when a user successfully verifies with World ID
	event Verified(uint256 nullifierHash);

	event PaymentReceived(uint256 amount);

	/// @param _worldId The WorldID router that will verify the proofs
	/// @param _appId The World ID app ID
	/// @param _actionId The World ID action ID
	constructor(IWorldID _worldId, string memory _appId, string memory _actionId) {
		worldId = _worldId;
		externalNullifier = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
		owner = msg.sender;
		admin = 0x8DF552AaAbd835CF20cB4a5DA6086fE67d7C6Fea;
		poolAvailableBalance = 0;
	}

	/// @param signal An arbitrary input from the user, usually the user's wallet address (check README for further details)
	/// @param root The root of the Merkle tree (returned by the JS widget).
	/// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
	/// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the JS widget).
	/// @dev Feel free to rename this method however you want! We've used `claim`, `verify` or `execute` in the past.
	function execute(address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof, uint _amount) public {
		// First, we make sure this person hasn't done this before
		if (nullifierHashes[nullifierHash]) revert DuplicateNullifier(nullifierHash);

		// We now verify the provided proof is valid and the user is verified by World ID
		worldId.verifyProof(
			root,
			groupId,
			abi.encodePacked(signal).hashToField(),
			nullifierHash,
			externalNullifier,
			proof
		);

		// We now record the user has done this, so they can't do it again (proof of uniqueness)
		nullifierHashes[nullifierHash] = true;

		// Finally, execute your logic here, for example issue a token, NFT, etc...
		// Make sure to emit some kind of event afterwards!

		withdrawFund(payable(signal), _amount);

		emit Verified(nullifierHash);
	}

	function withdrawFund(address payable recipient, uint256 amount) public {
		require(msg.sender == recipient, 'Only the recipient can withdraw the funds');
		require(userBalances[recipient].balance >= amount, 'Insufficient balance');
		// require(block.timestamp - userBalances[recipient].lastWithdraw >= 1 days, 'Can only withdraw once a day');
		userBalances[recipient].balance -= amount;
		userBalances[recipient].lastWithdraw = block.timestamp;
		recipient.transfer(amount);
	}

	function allocateFund(address recepient, uint256 amount) public {
		require(msg.sender == owner || msg.sender == admin, 'Only admin can allocate funds');
		require(this.getPoolBalance() >= amount, 'Insufficient pool balance');
		userBalances[recepient].balance += amount;
		poolAvailableBalance -= amount;
	}

	

	function sendFund(address payable recipient, uint256 amount) public {
		require(msg.sender == owner, 'Only admin can send the funds');
		require(userBalances[recipient].balance >= amount, 'Insufficient recepient balance');
		userBalances[recipient].balance -= amount;
		userBalances[recipient].lastWithdraw = block.timestamp;
		recipient.transfer(amount);
	}

	function changeOwner(address newOwner) public {
		require(msg.sender == owner, 'Only admin can change the owner');
		owner = newOwner;
	}

	function getOwner() public view returns (address) {
		return owner;
	}

	function getPoolBalance() public view returns (uint256) {
		return address(this).balance;
	}

	function getUserBalance(address user) public view returns (uint256) {
		return userBalances[user].balance;
	}


	function addToPool() public payable {
		poolAvailableBalance += msg.value;
		emit PaymentReceived(msg.value);
	}

	receive() external payable {
		poolAvailableBalance += msg.value;
		emit PaymentReceived(msg.value);
	}

}