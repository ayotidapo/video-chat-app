// import OpentokAxios from 'config/axiosInstance';

// export function createSession( {
//     return async dispatch => {
//       try {
//         dispatch({ type: LOAD_CREATE_SESSION });
//         const response = await OpentokAxios.get(`/auth/${userId}`, data);
//         if (response.data.success) {
//           const userDetails = response.data.data;
//           dispatch({
//             type: SUCCESS_PW_CREATE,
//           });
//           dispatch(updateUserDetails(userDetails.user));
//           history.replace('/login');
//         } else {
//           dispatch({
//             type: FAIL_PW_CREATE,
//             error: response.data.message,
//           }); // resolved error
//         }
//       } catch (err) {
//         const errorMsg = err.data ? err.data.message : 'Something went wrong';
//         cogoToast.error(errorMsg);
//         dispatch({
//           type: FAIL_PW_CREATE,
//           error: err.data ? err.data.message : 'Something went wrong',
//         });
//       }
//     };
//   }
