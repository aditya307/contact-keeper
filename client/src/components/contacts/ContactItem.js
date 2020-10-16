import React, { useContext } from 'react';
import Proptypes from 'prop-types';
import ContactContext from '../../context/contact/contactContext';
const ContactItem = ({ contact }) => {
  const contactContext = useContext(ContactContext);
  const { deleteContact, setCurrent, clearCurrent } = contactContext;
  // const type = 'proff';
  const { _id, name, email, phone, type } = contact;
  // console.log(type);
  // console.log(contact);
  const onDelete = () => {
    deleteContact(_id);
    clearCurrent();
    console.log('deleted');
  };
  return (
    <div className='card bg-light'>
      <h3 className='text-primary text-left'>
        {name}
        <span
          style={{ float: 'right' }}
          className={
            'badge ' +
            (type === 'professional' ? 'badge-success' : 'badge-primary')
          }
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </h3>
      <ul className='list'>
        {email && (
          <li>
            <i className='fa fa-envelope-open'></i> {email}
          </li>
        )}
        {phone && (
          <li>
            <i className='fa fa-phone'></i> {phone}
          </li>
        )}
      </ul>
      <p>
        <button
          className='btn btn-dark btn-sm'
          onClick={() => setCurrent(contact)}
        >
          Edit
        </button>
        <button className='btn btn-danger btn-sm' onClick={onDelete}>
          Delete
        </button>
      </p>
    </div>
  );
};
ContactItem.prototype = {
  contact: Proptypes.object.isRequired,
};

export default ContactItem;
