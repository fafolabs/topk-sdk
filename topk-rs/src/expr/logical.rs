use crate::data::Scalar;

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum UnaryOperator {
    Not,
    IsNull,
    IsNotNull,
}

impl Into<topk_protos::v1::data::logical_expr::unary_op::Op> for UnaryOperator {
    fn into(self) -> topk_protos::v1::data::logical_expr::unary_op::Op {
        match self {
            UnaryOperator::Not => topk_protos::v1::data::logical_expr::unary_op::Op::Not,
            UnaryOperator::IsNull => topk_protos::v1::data::logical_expr::unary_op::Op::IsNull,
            UnaryOperator::IsNotNull => {
                topk_protos::v1::data::logical_expr::unary_op::Op::IsNotNull
            }
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum BinaryOperator {
    // Logical ops
    And,
    Or,
    Xor,
    // Comparison ops
    Eq,
    NotEq,
    Lt,
    LtEq,
    Gt,
    GtEq,
    StartsWith,
    Contains,
    // Arithmetic ops
    Add,
    Sub,
    Mul,
    Div,
    Rem,
}

impl Into<topk_protos::v1::data::logical_expr::binary_op::Op> for BinaryOperator {
    fn into(self) -> topk_protos::v1::data::logical_expr::binary_op::Op {
        match self {
            BinaryOperator::Eq => topk_protos::v1::data::logical_expr::binary_op::Op::Eq,
            BinaryOperator::NotEq => topk_protos::v1::data::logical_expr::binary_op::Op::Neq,
            BinaryOperator::Lt => topk_protos::v1::data::logical_expr::binary_op::Op::Lt,
            BinaryOperator::LtEq => topk_protos::v1::data::logical_expr::binary_op::Op::Lte,
            BinaryOperator::Gt => topk_protos::v1::data::logical_expr::binary_op::Op::Gt,
            BinaryOperator::GtEq => topk_protos::v1::data::logical_expr::binary_op::Op::Gte,
            BinaryOperator::StartsWith => {
                topk_protos::v1::data::logical_expr::binary_op::Op::StartsWith
            }
            BinaryOperator::Contains => {
                topk_protos::v1::data::logical_expr::binary_op::Op::Contains
            }
            BinaryOperator::Add => topk_protos::v1::data::logical_expr::binary_op::Op::Add,
            BinaryOperator::Sub => topk_protos::v1::data::logical_expr::binary_op::Op::Sub,
            BinaryOperator::Mul => topk_protos::v1::data::logical_expr::binary_op::Op::Mul,
            BinaryOperator::Div => topk_protos::v1::data::logical_expr::binary_op::Op::Div,
            BinaryOperator::And => topk_protos::v1::data::logical_expr::binary_op::Op::And,
            BinaryOperator::Or => topk_protos::v1::data::logical_expr::binary_op::Op::Or,
            BinaryOperator::Xor => unreachable!("Xor is not supported"),
            BinaryOperator::Rem => unreachable!("Rem is not supported"),
        }
    }
}

#[derive(Clone, Debug)]
pub enum LogicalExpr {
    Null(),
    Field {
        name: String,
    },
    Literal {
        value: Scalar,
    },
    Unary {
        op: UnaryOperator,
        expr: Box<LogicalExpr>,
    },
    Binary {
        left: Box<LogicalExpr>,
        op: BinaryOperator,
        right: Box<LogicalExpr>,
    },
}

impl LogicalExpr {
    // Comparison operators
    pub fn eq(&self, other: impl Into<LogicalExpr>) -> Self {
        Self::Binary {
            left: Box::new(self.clone()),
            op: BinaryOperator::Eq,
            right: Box::new(other.into()),
        }
    }

    pub fn ne(&self, other: impl Into<LogicalExpr>) -> Self {
        Self::Binary {
            left: Box::new(self.clone()),
            op: BinaryOperator::NotEq,
            right: Box::new(other.into()),
        }
    }

    pub fn lt(&self, other: impl Into<LogicalExpr>) -> Self {
        Self::Binary {
            left: Box::new(self.clone()),
            op: BinaryOperator::Lt,
            right: Box::new(other.into()),
        }
    }

    pub fn lte(&self, other: impl Into<LogicalExpr>) -> Self {
        Self::Binary {
            left: Box::new(self.clone()),
            op: BinaryOperator::LtEq,
            right: Box::new(other.into()),
        }
    }

    pub fn gt(&self, other: impl Into<LogicalExpr>) -> Self {
        Self::Binary {
            left: Box::new(self.clone()),
            op: BinaryOperator::Gt,
            right: Box::new(other.into()),
        }
    }

    pub fn gte(&self, other: impl Into<LogicalExpr>) -> Self {
        Self::Binary {
            left: Box::new(self.clone()),
            op: BinaryOperator::GtEq,
            right: Box::new(other.into()),
        }
    }

    // Arithmetic operators
    pub fn add(&self, other: impl Into<LogicalExpr>) -> Self {
        Self::Binary {
            left: Box::new(self.clone()),
            op: BinaryOperator::Add,
            right: Box::new(other.into()),
        }
    }

    pub fn sub(&self, other: impl Into<LogicalExpr>) -> Self {
        Self::Binary {
            left: Box::new(self.clone()),
            op: BinaryOperator::Sub,
            right: Box::new(other.into()),
        }
    }

    pub fn mul(&self, other: impl Into<LogicalExpr>) -> Self {
        Self::Binary {
            left: Box::new(self.clone()),
            op: BinaryOperator::Mul,
            right: Box::new(other.into()),
        }
    }

    pub fn div(&self, other: impl Into<LogicalExpr>) -> Self {
        Self::Binary {
            left: Box::new(self.clone()),
            op: BinaryOperator::Div,
            right: Box::new(other.into()),
        }
    }

    // Boolean operators
    pub fn and(&self, other: impl Into<LogicalExpr>) -> Self {
        Self::Binary {
            left: Box::new(self.clone()),
            op: BinaryOperator::And,
            right: Box::new(other.into()),
        }
    }

    pub fn or(&self, other: impl Into<LogicalExpr>) -> Self {
        Self::Binary {
            left: Box::new(self.clone()),
            op: BinaryOperator::Or,
            right: Box::new(other.into()),
        }
    }

    // String operators
    pub fn starts_with(&self, other: impl Into<LogicalExpr>) -> Self {
        Self::Binary {
            left: Box::new(self.clone()),
            op: BinaryOperator::StartsWith,
            right: Box::new(other.into()),
        }
    }

    pub fn contains(&self, other: impl Into<LogicalExpr>) -> Self {
        Self::Binary {
            left: Box::new(self.clone()),
            op: BinaryOperator::Contains,
            right: Box::new(other.into()),
        }
    }
}

impl std::ops::Add for LogicalExpr {
    type Output = Self;

    fn add(self, other: Self) -> Self {
        LogicalExpr::add(&self, other)
    }
}

impl std::ops::Sub for LogicalExpr {
    type Output = Self;

    fn sub(self, other: Self) -> Self {
        LogicalExpr::sub(&self, other)
    }
}

impl std::ops::Mul for LogicalExpr {
    type Output = Self;

    fn mul(self, other: Self) -> Self {
        LogicalExpr::mul(&self, other)
    }
}

impl std::ops::Div for LogicalExpr {
    type Output = Self;

    fn div(self, other: Self) -> Self {
        LogicalExpr::div(&self, other)
    }
}

impl From<u32> for LogicalExpr {
    fn from(value: u32) -> Self {
        LogicalExpr::Literal {
            value: Scalar::U32(value),
        }
    }
}

impl From<&'static str> for LogicalExpr {
    fn from(value: &'static str) -> Self {
        LogicalExpr::Literal {
            value: Scalar::String(value.to_string()),
        }
    }
}

impl Into<topk_protos::v1::data::LogicalExpr> for LogicalExpr {
    fn into(self) -> topk_protos::v1::data::LogicalExpr {
        match self {
            LogicalExpr::Null() => unreachable!(),
            LogicalExpr::Field { name } => topk_protos::v1::data::LogicalExpr::field(name),
            LogicalExpr::Literal { value } => {
                topk_protos::v1::data::LogicalExpr::literal(value.into())
            }
            LogicalExpr::Unary { op, expr } => {
                topk_protos::v1::data::LogicalExpr::unary(op.into(), (*expr).into())
            }
            LogicalExpr::Binary { left, op, right } => topk_protos::v1::data::LogicalExpr::binary(
                op.into(),
                (*left).into(),
                (*right).into(),
            ),
        }
    }
}
