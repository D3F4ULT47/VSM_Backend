class apiError extends Error{
  constructor(
    statusCode,
    message="Something went error",
    error=[],
    stack=""

  ){
  super(message) // error class only accepts "message" so we can only have message inheritance 
  this.statusCode=statusCode
  this.data=null
  this.success=false
  this.error=error

  if(stack){
    this.stack=stack
  }else{
    Error.captureStackTrace9this,this.constructor
   }
  }
} export {apiError}