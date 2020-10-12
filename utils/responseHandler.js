const HTTP_STATUS = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 404,
    UN_AUTHENTICATED: 401,
    UN_AUTHORISED: 403,
    INTERNAL_SERVER_ERROR: 500
  };
  
  const clientError = (response, data, message) => {
    const jsonResponse = {
      success: false,
      data: data,
      message: message
    }
    return response.status(HTTP_STATUS.BAD_REQUEST).json(jsonResponse)
  }
  
  const successDataResponse = (response, data, message) => {
    const jsonResponse = {
      success: true,
      data: data,
      message : message
    }
    return response.status(HTTP_STATUS.SUCCESS).json(jsonResponse)
  }
  
  const createdResponse = (response, message = 'Success') => {
    const jsonResponse = {
      success: true,
      message: message
    }
    return response.status(HTTP_STATUS.CREATED).json(jsonResponse)
  }
  
  const successPaginatedDataResponse = (response, data, page, limit, message) => {
    const jsonResponse = {
      success: true,
      data: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: data.count,
        results: data.rows
      },
      message : message
    }
    return response.status(HTTP_STATUS.SUCCESS).json(jsonResponse)
  }
  
  const serverError = (response, message = 'Something went wrong.') => {
    const jsonResponse = {
      success: false,
      message: message
    }
    return response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(jsonResponse)
  }
  
  const unAuthenticated = (response) => {
    return response.status(HTTP_STATUS.UN_AUTHENTICATED).json({
      message: "You are not signed in"
    });
  }
  
  const unAuthorised = (response) => {
    return response.status(HTTP_STATUS.UN_AUTHORISED).json({
      message: "Unauthorised access, you do not have sufficient access for accessing the page"
    });
  }
  
  
  
  module.exports = {
    successDataResponse,
    successPaginatedDataResponse,
    serverError,
    createdResponse,
    clientError,
    unAuthenticated,
    unAuthorised,
  }
  