pragma solidity >=0.5.0 <0.7.0;

contract Counter {
  uint32 public current_value;

  function inc() public {
    require(current_value < 10000, "Counter: max value");
    current_value = current_value + 1;
  }

  function dec() public {
    require(current_value > 0, "Counter: min value");
    current_value = current_value - 1;
  }
}