import { useGetAddresses, useGetAddressKeys, useNotifications } from 'react-components';
import { c } from 'ttag';
import getPrimaryKey from 'proton-shared/lib/keys/getPrimaryKey';
import { getActiveAddresses } from 'proton-shared/lib/helpers/address';
import { sign as signMessage } from 'proton-shared/lib/keys/driveKeys';
import { Address } from 'proton-shared/lib/interfaces/Address';
import { splitKeys } from 'proton-shared/lib/keys/keys';
import { OpenPGPKey } from 'pmcrypto';

function useDriveCrypto() {
    const { createNotification } = useNotifications();
    const getAddressKeys = useGetAddressKeys();
    const getAddresses = useGetAddresses();

    const getPrimaryAddressKey = async () => {
        const addresses = await getAddresses();
        const [activeAddress] = getActiveAddresses(addresses);

        if (!activeAddress) {
            createNotification({ text: c('Error').t`No valid address found`, type: 'error' });
            throw new Error('User has no active address');
        }

        const { privateKey, publicKey } = getPrimaryKey(await getAddressKeys(activeAddress.ID)) || {};

        if (!privateKey || !privateKey.isDecrypted()) {
            // Should never happen
            throw new Error('Primary private key is not decrypted');
        }

        return { privateKey, publicKey, address: activeAddress };
    };

    const getVerificationKeys = async (addressId: string) => {
        return splitKeys(await getAddressKeys(addressId));
    };

    const sign = async (payload: string, keys?: { privateKey: OpenPGPKey; address: Address }) => {
        const { privateKey, address } = keys || (await getPrimaryAddressKey());
        const signature = await signMessage(payload, [privateKey]);
        return { signature, address };
    };

    return { getPrimaryAddressKey, getVerificationKeys, sign };
}

export default useDriveCrypto;
