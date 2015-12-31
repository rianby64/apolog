Feature: Testing parameters
  Background: A background
    Given a given background <param2>
     | x1 | x2 | x3 |
     | y1 | y2 | y3 |
     | z1 | z2 | z3 |

  Scenario Outline: Simple scenario <param1>
    Given A given <param2>
      | m1 | m2 | m3 |
    When A when <param3> <param2>
    Then A step <param1>
      | m1 | m2 | m3 |
      | n1 | n2 | n3 |

    Examples:
      | param1 | param2 | param3 |
      |  abc   |   x1   |  xyz   |
      |  ijk   |   x2   |  pqr   |

  Scenario Outline: Another scenario <paramX>
    Given A given <param2>
    When A when <paramX> <param2>
    Then A step <param2>

    Examples:
      | param2 | paramX |
      |   x3   |   y1   |
