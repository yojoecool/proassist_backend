import { Admin, Company } from '../models';
import { companyStatus } from '../constants';

const setCompStatus = async (userId, status) => {
  if (!companyStatus.includes(status)) {
    throw new Error('bad_status');
  }

  await Company.update({ status }, { where: { userId } });
  return true;
}

module.exports = {
  setCompStatus
};
