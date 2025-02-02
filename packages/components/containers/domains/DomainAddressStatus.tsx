import { c } from 'ttag';

import { ADDRESS_STATUS, RECEIVE_ADDRESS } from '@proton/shared/lib/constants';
import { DomainAddress } from '@proton/shared/lib/interfaces';

import { Badge } from '../../components';

interface Props {
    address: DomainAddress;
}

const DomainAddressStatus = ({ address }: Props) => {
    const { Status, Receive, HasKeys } = address;

    if (HasKeys === 0) {
        return <Badge type="warning" className="text-nowrap">{c('Badge for domain').t`Missing keys`}</Badge>;
    }

    if (Status === ADDRESS_STATUS.STATUS_ENABLED && Receive === RECEIVE_ADDRESS.RECEIVE_YES) {
        return <Badge type="success" className="text-nowrap">{c('Badge for domain').t`Enabled`}</Badge>;
    }

    if (Status === ADDRESS_STATUS.STATUS_DISABLED) {
        return <Badge type="error" className="text-nowrap">{c('Badge for domain').t`Disabled`}</Badge>;
    }

    return null;
};

export default DomainAddressStatus;
