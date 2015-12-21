Feature: Matching order
  Scenario: A lot of similar steps
   Given Param1 Param2 Param3 Param4
   When Param1 Param2 Param3 Param
   When Param1 Param2 Param Param
   When Param1 Param Param Param
   Then Param Param Param Param4
   Then Param Param Param3 Param4
   Then Param Param2 Param3 Param4
   Then Param Param Param Param
